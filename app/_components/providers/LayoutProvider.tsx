'use client';

import { usePathname } from 'next/navigation';
import { TabNavigation } from '@/app/_components/tab-navigations/TabNavigation';
import Header from '@/app/_components/layouts/Header';
import { useLayoutRoute } from '@/public/utils/layoutRoute';

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const layout = useLayoutRoute(pathname);

  return (
    <>
      {layout.showHeader && <Header />}
      {children}
      {layout.showTab && <TabNavigation />}
    </>
  );
};

export default LayoutProvider;
