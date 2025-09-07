import React from 'react';
import Header from '@/app/_components/layouts/Header';
import { TabNavigation } from '@/app/_components/tab-navigations/TabNavigation';

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
