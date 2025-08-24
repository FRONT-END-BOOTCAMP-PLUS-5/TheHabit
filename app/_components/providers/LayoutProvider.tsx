'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { TabNavigation } from '@/app/_components/tab-navigations/TabNavigation';
import Header from '@/app/_components/layouts/Header';
import {
  PATHS_SHOWING_TAB_ONLY,
  PATHS_HIDING_HEADER_AND_TAB,
  PATHS_SHOWING_HEADER_ONLY,
  PATHS_SHOWING_HEADER_AND_TAB,
} from '@/public/consts/routeName';

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // 노출 규칙

  // 탭만 노출
  if (PATHS_SHOWING_TAB_ONLY.some(path => pathname.startsWith(path))) {
    return (
      <>
        {children}
        <TabNavigation />
      </>
    );
  }

  // 헤더/탭 모두 숨김 (루트 정확 일치, 혹은 지정된 경로 프리픽스)
  if (pathname === '/' || PATHS_HIDING_HEADER_AND_TAB.some(path => pathname.startsWith(path))) {
    return <>{children}</>;
  }

  // 헤더만 노출
  if (PATHS_SHOWING_HEADER_ONLY.some(path => pathname.startsWith(path))) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  // 헤더와 탭 모두 노출
  if (PATHS_SHOWING_HEADER_AND_TAB.some(path => pathname.startsWith(path))) {
    return (
      <>
        <Header />
        {children}
        <TabNavigation />
      </>
    );
  }

  return <>{children}</>;
};

export default LayoutProvider;
