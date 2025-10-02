import React from 'react';

import { TabNavigation } from '@/app/_components/tab-navigations/TabNavigation';
import type { Metadata } from 'next';
import Header from '@/app/(anon)/_components/Header';

export const metadata: Metadata = {
  title: { default: '비회원 홈', template: '%s | TheHabit' },
  description: '로그인 없이 TheHabit 기능을 체험해보세요.',
  openGraph: {
    title: 'TheHabit',
    description: '로그인 없이 TheHabit 기능을 체험해보세요.',
    url: '/', // metadataBase와 합쳐 절대 URL 됨
    images: ['/images/icons/Logo-192.png'],
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const AnonLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <TabNavigation />
    </div>
  );
};

export default AnonLayout;
