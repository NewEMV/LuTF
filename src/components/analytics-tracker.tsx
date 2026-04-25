'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent, newPageViewId, getOrUpdateUtmData } from '@/lib/analytics/firestore-tracker';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Gera novo page_view_id a cada mudança de rota
    newPageViewId();

    // Captura/atualiza UTMs da URL atual
    const utmData = getOrUpdateUtmData();

    // Helper: envia para GA4
    const sendGA4 = (eventName: string, eventParams: Record<string, any>) => {
      const win = window as any;
      if (typeof win.gtag === 'function') {
        win.gtag('event', eventName, eventParams);
      }
    };

    // URL atual para event_label no GA4
    const eventLabel = window.location.href;
    const pagePath = window.location.pathname;

    // ─── 1. PAGE VIEW ───────────────────────────────────────────────────────
    const pageParams = {
      page: eventLabel,
      page_path: pagePath,
      page_title: document.title,
      utm_source: utmData.source,
      utm_medium: utmData.medium,
      utm_campaign: utmData.campaign,
      utm_content: utmData.content,
      utm_term: utmData.term,
      referrer: document.referrer,
    };
    trackEvent('page_view', pageParams);

    // ─── 2. SESSION START ────────────────────────────────────────────────────
    // Dispara apenas uma vez por sessão (na primeira page_view)
    const sessionKey = 'lt_session_tracked';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      const win = window as any;
      const ua = navigator.userAgent;
      const isMobile = /Mobi|Android/i.test(ua);
      const isTablet = /Tablet|iPad/i.test(ua);
      const device_type = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

      trackEvent('session_start', {
        landing_page: eventLabel,
        utm_source: utmData.source,
        utm_medium: utmData.medium,
        utm_campaign: utmData.campaign,
        utm_content: utmData.content,
        utm_term: utmData.term,
        referrer: document.referrer,
        device_type,
      });
    }

    // ─── 3. SCROLL DEPTH ─────────────────────────────────────────────────────
    let maxScroll = 0;
    const scrollFired = { 25: false, 50: false, 75: false, 90: false };
    let engagementFired = false;

    let scrollDebounce: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (scrollDebounce) return; // debounce: ignora scroll em menos de 200ms
      scrollDebounce = setTimeout(() => {
        scrollDebounce = null;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        if (docHeight <= winHeight) return;

        const pct = Math.round((scrollTop / (docHeight - winHeight)) * 100);
        if (pct <= maxScroll) return;
        maxScroll = pct;

        const depths: (25 | 50 | 75 | 90)[] = [25, 50, 75, 90];
        for (const d of depths) {
          if (maxScroll >= d && !scrollFired[d]) {
            scrollFired[d] = true;
            const params = { depth: d, page: eventLabel };
            sendGA4(`scroll_${d}`, { event_category: 'engagement', event_label: eventLabel });
            trackEvent('scroll_depth', params);

            // Engagement: scroll >= 50%
            if (d >= 50 && !engagementFired) {
              engagementFired = true;
              trackEvent('engagement', { trigger_reason: `scroll_${d}`, page: eventLabel });
            }
          }
        }
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ─── 4. TIME ON PAGE ─────────────────────────────────────────────────────
    const timeFired = { 30: false, 60: false, 120: false };

    const makeTimer = (seconds: 30 | 60 | 120) =>
      setTimeout(() => {
        if (timeFired[seconds]) return;
        timeFired[seconds] = true;
        sendGA4(`time_${seconds}s`, { event_category: 'engagement', event_label: eventLabel });
        trackEvent('time_on_page', { duration: seconds, page: eventLabel });

        // Engagement: tempo >= 30s
        if (seconds >= 30 && !engagementFired) {
          engagementFired = true;
          trackEvent('engagement', { trigger_reason: `time_${seconds}s`, page: eventLabel });
        }
      }, seconds * 1000);

    const timer30 = makeTimer(30);
    const timer60 = makeTimer(60);
    const timer120 = makeTimer(120);

    // ─── 5. CLIQUES ──────────────────────────────────────────────────────────
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      const button = target.closest('button');

      const getId = (el: Element | null) => el?.id || '';
      const getName = (el: Element | null) =>
        el?.getAttribute('name') || el?.getAttribute('aria-label') || el?.getAttribute('data-cta') || '';
      const getText = (el: Element | null) => el?.textContent?.trim().slice(0, 100) || '';
      const getClasses = (el: Element | null) => (el as HTMLElement)?.className?.slice(0, 200) || '';
      const getSection = (el: Element | null): string => {
        if (!el) return '';
        const closest = el.closest('header, footer, nav, main, section, article');
        return closest?.tagName?.toLowerCase() || '';
      };

      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
        const isCtaLink =
          anchor.classList.contains('btn') ||
          anchor.classList.contains('cta') ||
          anchor.getAttribute('role') === 'button';

        if (isCtaLink) {
          const p = {
            button_text: getText(anchor),
            button_id: getId(anchor),
            button_class: getClasses(anchor),
            cta_type: anchor.getAttribute('data-cta-type') || 'other',
            page_origin: eventLabel,
            link_url: href,
          };
          sendGA4('click_cta', { event_category: 'engagement', event_label: eventLabel, button_text: p.button_text, button_id: p.button_id, button_name: getName(anchor) });
          trackEvent('click_cta', p);
        } else if (href) {
          if (isExternal) {
            const p = { link_url: href, link_text: getText(anchor), page_origin: eventLabel };
            sendGA4('click_external', { event_category: 'engagement', event_label: eventLabel, link_url: href, link_text: p.link_text });
            trackEvent('click_external', p);
          } else {
            const p = {
              link_url: href,
              link_text: getText(anchor),
              link_class: getClasses(anchor),
              page_origin: eventLabel,
              section: getSection(anchor),
            };
            sendGA4('click_internal', { event_category: 'engagement', event_label: eventLabel, link_url: href, link_text: p.link_text, link_id: getId(anchor) });
            trackEvent('click_internal', p);
          }
        }
      } else if (button || target.closest('[role="button"]') || target.closest('.btn') || target.closest('.cta')) {
        const el = button || target.closest('[role="button"]') || target.closest('.btn') || target.closest('.cta');
        const p = {
          button_text: getText(el),
          button_id: getId(el),
          button_class: getClasses(el),
          cta_type: (el as HTMLElement)?.getAttribute('data-cta-type') || 'other',
          page_origin: eventLabel,
        };
        sendGA4('click_cta', { event_category: 'engagement', event_label: eventLabel, button_text: p.button_text, button_id: p.button_id, button_name: getName(el) });
        trackEvent('click_cta', p);
      }
    };

    document.addEventListener('click', handleClick);

    // ─── LIMPEZA ─────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      clearTimeout(timer30);
      clearTimeout(timer60);
      clearTimeout(timer120);
      if (scrollDebounce) clearTimeout(scrollDebounce);
    };
  }, [pathname, searchParams]);

  return null;
}
