'use client';

import { usePathname } from 'next/navigation';
import { TabNavigation } from '@/app/_components/layouts/TabNavigation';
import Header from '@/app/_components/layouts/Header';
import { useLayoutRoute } from '@/public/utils/layoutRoute';

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const layout = useLayoutRoute(pathname);

  return (
    <div className='mb-14'>
      {layout.showHeader && <Header />}
      {children}
      {layout.showTab && <TabNavigation />}
    </div>
  );
};

export default LayoutProvider;
