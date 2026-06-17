'use client';

import { useEffect } from 'react';

function isInternalNavigation(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || anchor.target === '_blank') return false;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;

  const url = new URL(href, window.location.origin);
  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return false;
  }

  return true;
}

/**
 * 작업 진행 중 내부 링크 클릭·뒤로가기·탭 닫기를 막습니다.
 */
export function useNavigationBlocker(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleClickCapture = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest('a');
      if (!anchor || !isInternalNavigation(anchor)) return;

      e.preventDefault();
      e.stopPropagation();
    };

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClickCapture, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClickCapture, true);
    };
  }, [enabled]);
}
