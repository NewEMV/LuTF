/**
 * firestore-tracker.ts
 * Rastreamento customizado de comportamento do usuário para Firestore.
 * Funciona de forma independente do GA4 (não duplica eventos).
 */

import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, Timestamp } from 'firebase/firestore';

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────
const CLIENT_ID_KEY = 'lt_client_id';
const SESSION_ID_KEY = 'lt_session_id';
const SESSION_LAST_ACTIVITY_KEY = 'lt_session_last_activity';
const UTM_STORAGE_KEY = 'lt_utm_data';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos
const BATCH_FLUSH_INTERVAL_MS = 3000; // flush a cada 3s
const RATE_LIMIT_MS = 1000; // 1 evento do mesmo tipo por segundo
const MAX_BUFFER_SIZE = 50; // máximo de eventos na fila (evita acúmulo em falhas)
const COLLECTION = 'analytics_events';

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────
export interface UtmData {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

export interface PageData {
  url: string;
  path: string;
  title: string;
  referrer: string;
}

export interface UserData {
  user_agent: string;
  screen_resolution: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
}

export interface AnalyticsEvent {
  client_id: string;
  session_id: string;
  page_view_id: string;
  event_name: string;
  event_timestamp: Timestamp;
  event_params: Record<string, any>;
  utm_data: UtmData;
  page_data: PageData;
  user_data: UserData;
}

// ─────────────────────────────────────────────
// GERADOR DE ID ÚNICO
// ─────────────────────────────────────────────
function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${timestamp}${random}`;
}

// ─────────────────────────────────────────────
// CLIENT ID (localStorage, 2 anos)
// ─────────────────────────────────────────────
function getOrCreateClientId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let clientId = localStorage.getItem(CLIENT_ID_KEY);
    if (!clientId) {
      clientId = generateId('c');
      localStorage.setItem(CLIENT_ID_KEY, clientId);
    }
    return clientId;
  } catch {
    return generateId('c');
  }
}

// ─────────────────────────────────────────────
// SESSION ID (sessionStorage, renova após 30min de inatividade)
// ─────────────────────────────────────────────
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const now = Date.now();
    const lastActivity = parseInt(sessionStorage.getItem(SESSION_LAST_ACTIVITY_KEY) || '0', 10);
    const existingId = sessionStorage.getItem(SESSION_ID_KEY);

    // Renova sessão se expirou por inatividade
    if (!existingId || now - lastActivity > SESSION_TIMEOUT_MS) {
      const newId = generateId('s');
      sessionStorage.setItem(SESSION_ID_KEY, newId);
      sessionStorage.setItem(SESSION_LAST_ACTIVITY_KEY, now.toString());
      return newId;
    }

    // Atualiza o timestamp de última atividade
    sessionStorage.setItem(SESSION_LAST_ACTIVITY_KEY, now.toString());
    return existingId;
  } catch {
    return generateId('s');
  }
}

// ─────────────────────────────────────────────
// PAGE VIEW ID (novo a cada carregamento de rota)
// ─────────────────────────────────────────────
let currentPageViewId = generateId('pv');

export function newPageViewId(): string {
  currentPageViewId = generateId('pv');
  return currentPageViewId;
}

export function getPageViewId(): string {
  return currentPageViewId;
}

// ─────────────────────────────────────────────
// CAPTURA E PERSISTÊNCIA DE UTMs
// ─────────────────────────────────────────────
function parseUtmsFromUrl(): Partial<UtmData> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Partial<UtmData> = {};
  if (params.get('utm_source')) utms.source = params.get('utm_source')!;
  if (params.get('utm_medium')) utms.medium = params.get('utm_medium')!;
  if (params.get('utm_campaign')) utms.campaign = params.get('utm_campaign')!;
  if (params.get('utm_content')) utms.content = params.get('utm_content')!;
  if (params.get('utm_term')) utms.term = params.get('utm_term')!;
  return utms;
}

export function getOrUpdateUtmData(): UtmData {
  const empty: UtmData = { source: '', medium: '', campaign: '', content: '', term: '' };
  if (typeof window === 'undefined') return empty;

  try {
    const urlUtms = parseUtmsFromUrl();
    const hasNewUtms = Object.keys(urlUtms).length > 0;

    if (hasNewUtms) {
      // Novos UTMs na URL: mescla com os salvos
      const saved = JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) || '{}');
      const merged: UtmData = { ...empty, ...saved, ...urlUtms };
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    // Sem novos UTMs: retorna o que estava salvo
    const saved = JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) || '{}');
    return { ...empty, ...saved };
  } catch {
    return empty;
  }
}

// ─────────────────────────────────────────────
// DADOS DO USUÁRIO
// ─────────────────────────────────────────────
function getUserData(): UserData {
  if (typeof window === 'undefined') {
    return { user_agent: '', screen_resolution: '', device_type: 'desktop' };
  }
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);
  const device_type: UserData['device_type'] = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

  return {
    user_agent: ua,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    device_type,
  };
}

// ─────────────────────────────────────────────
// DADOS DA PÁGINA
// ─────────────────────────────────────────────
function getPageData(): PageData {
  if (typeof window === 'undefined') return { url: '', path: '', title: '', referrer: '' };
  return {
    url: window.location.href,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer,
  };
}

// ─────────────────────────────────────────────
// RATE LIMITING
// ─────────────────────────────────────────────
const rateLimitMap = new Map<string, number>();

function isRateLimited(eventName: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(eventName) || 0;
  if (now - last < RATE_LIMIT_MS) return true;
  rateLimitMap.set(eventName, now);
  return false;
}

// ─────────────────────────────────────────────
// BUFFER DE EVENTOS (BATCH WRITE)
// ─────────────────────────────────────────────
let eventBuffer: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let isFlushing = false; // impede execuções paralelas do flush

async function flushBuffer() {
  // Garante que apenas uma execução ocorra por vez
  if (isFlushing || eventBuffer.length === 0) return;
  isFlushing = true;

  const eventsToWrite = [...eventBuffer];
  eventBuffer = [];

  try {
    // Firestore writeBatch suporta até 500 ops
    const chunks: AnalyticsEvent[][] = [];
    for (let i = 0; i < eventsToWrite.length; i += 499) {
      chunks.push(eventsToWrite.slice(i, i + 499));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const event of chunk) {
        const ref = doc(collection(db, COLLECTION));
        batch.set(ref, event);
      }
      await batch.commit();
    }
  } catch (err) {
    // Em falha, descarta silenciosamente para não criar loops de retry.
    // O próximo evento do usuário vai acionar um novo flush naturalmente.
    console.warn('[Analytics] Falha no batch write, eventos descartados para evitar loop:', err);
  } finally {
    isFlushing = false;
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushBuffer();
  }, BATCH_FLUSH_INTERVAL_MS);
}

// Flush imediato ao fechar a página
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (eventBuffer.length > 0) {
      // Usa sendBeacon para garantir entrega mesmo ao fechar a aba
      // Como o Firestore não suporta sendBeacon nativamente, tentamos um flush síncrono
      flushBuffer();
    }
  });
}

// ─────────────────────────────────────────────
// VALIDAÇÃO BÁSICA
// ─────────────────────────────────────────────
function validateParams(params: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    // Nunca salvar senhas ou tokens
    if (/passw|token|secret|auth/i.test(key)) continue;
    // Limitar strings a 500 caracteres
    sanitized[key] = typeof value === 'string' ? value.slice(0, 500) : value;
  }
  return sanitized;
}

// ─────────────────────────────────────────────
// FUNÇÃO PRINCIPAL: RASTREAR EVENTO
// ─────────────────────────────────────────────
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  if (isRateLimited(eventName)) return;

  // Descarta o evento se o buffer estiver cheio (proteção contra acúmulo em falhas)
  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    console.warn('[Analytics] Buffer cheio, evento descartado:', eventName);
    return;
  }

  const event: AnalyticsEvent = {
    client_id: getOrCreateClientId(),
    session_id: getOrCreateSessionId(),
    page_view_id: getPageViewId(),
    event_name: eventName,
    event_timestamp: Timestamp.now(),
    event_params: validateParams(params),
    utm_data: getOrUpdateUtmData(),
    page_data: getPageData(),
    user_data: getUserData(),
  };

  eventBuffer.push(event);
  scheduleFlush();
}
