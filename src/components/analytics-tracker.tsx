'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Apenas executa no browser
    if (typeof window === 'undefined') return;

    // Helper para enviar eventos do gtag
    const sendEvent = (eventName: string, eventParams: any) => {
      const win = window as any;
      if (typeof win.gtag === 'function') {
        win.gtag('event', eventName, eventParams);
      }
    };

    // Variáveis de estado para controlar a página atual (evita disparos duplos)
    let maxScroll = 0;
    const scrollEventsFired = {
      25: false,
      50: false,
      75: false,
      90: false,
    };

    const timeEventsFired = {
      30: false,
      60: false,
    };

    // Label do evento (URL atual)
    const eventLabel = window.location.href;

    // 1. Rastreador de Profundidade de Scroll
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      // Evita divisão por zero
      if (docHeight <= winHeight) return;

      const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        if (maxScroll >= 25 && !scrollEventsFired[25]) {
          scrollEventsFired[25] = true;
          sendEvent('scroll_25', { event_category: 'engagement', event_label: eventLabel });
        }
        if (maxScroll >= 50 && !scrollEventsFired[50]) {
          scrollEventsFired[50] = true;
          sendEvent('scroll_50', { event_category: 'engagement', event_label: eventLabel });
        }
        if (maxScroll >= 75 && !scrollEventsFired[75]) {
          scrollEventsFired[75] = true;
          sendEvent('scroll_75', { event_category: 'engagement', event_label: eventLabel });
        }
        if (maxScroll >= 90 && !scrollEventsFired[90]) {
          scrollEventsFired[90] = true;
          sendEvent('scroll_90', { event_category: 'engagement', event_label: eventLabel });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Chama uma vez para verificar o scroll inicial caso a página seja curta
    handleScroll();

    // 2. Rastreador de Tempo na Página
    const timer30 = setTimeout(() => {
      if (!timeEventsFired[30]) {
        timeEventsFired[30] = true;
        sendEvent('time_30s', { event_category: 'engagement', event_label: eventLabel });
      }
    }, 30000);

    const timer60 = setTimeout(() => {
      if (!timeEventsFired[60]) {
        timeEventsFired[60] = true;
        sendEvent('time_60s', { event_category: 'engagement', event_label: eventLabel });
      }
    }, 60000);

    // 3. Rastreador de Cliques
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Encontrar o link ou botão mais próximo
      const anchor = target.closest('a');
      const button = target.closest('button');

      // Helper para extrair identificação (ID, Name, Text)
      const getElementId = (el: Element | null) => el?.id || '';
      const getElementName = (el: Element | null) => el?.getAttribute('name') || el?.getAttribute('aria-label') || el?.getAttribute('data-cta') || '';
      const getElementText = (el: Element | null) => el?.textContent?.trim().slice(0, 50) || '';

      if (anchor) {
        const href = anchor.getAttribute('href');
        const isExternal = href?.startsWith('http') && !href.includes(window.location.hostname);
        
        // Alguns CTAs são tags <a> (ex: link do whatsapp, link para agendamento)
        const isCtaLink = anchor.classList.contains('btn') || anchor.classList.contains('cta') || anchor.getAttribute('role') === 'button';

        if (isCtaLink) {
          sendEvent('click_cta', { 
            event_category: 'engagement', 
            event_label: eventLabel, 
            button_text: getElementText(anchor) || 'Link CTA',
            button_id: getElementId(anchor),
            button_name: getElementName(anchor),
            link_url: href
          });
        } else if (href) {
          if (isExternal) {
            sendEvent('click_external', { 
              event_category: 'engagement', 
              event_label: eventLabel, 
              link_url: href,
              link_text: getElementText(anchor),
              link_id: getElementId(anchor)
            });
          } else {
            sendEvent('click_internal', { 
              event_category: 'engagement', 
              event_label: eventLabel, 
              link_url: href,
              link_text: getElementText(anchor),
              link_id: getElementId(anchor)
            });
          }
        }
      } else if (button || target.closest('[role="button"]') || target.closest('.btn') || target.closest('.cta')) {
        // Consideramos botões e elementos com role="button" como CTAs
        const btnElement = button || target.closest('[role="button"]') || target.closest('.btn') || target.closest('.cta');
        sendEvent('click_cta', { 
          event_category: 'engagement', 
          event_label: eventLabel, 
          button_text: getElementText(btnElement) || 'Botão',
          button_id: getElementId(btnElement),
          button_name: getElementName(btnElement)
        });
      }
    };

    document.addEventListener('click', handleClick);

    // Limpeza dos eventos ao desmontar ou trocar de rota
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      clearTimeout(timer30);
      clearTimeout(timer60);
    };
  }, [pathname, searchParams]); // Executa novamente a cada mudança de rota

  return null;
}
