import type { Metadata } from 'next';
import '@/app/globals.css';
import { QueryProvider } from '@/app/_components/query-providers/QueryProvider';
import ModalProvider from '@/app/_components/providers/ModalProvider';
import NextAuthSessionProvider from '@/app/_components/providers/NextAuthSessionProvider';
import Header from '@/app/_components/layouts/Header';
import { pretendard } from '@/public/fonts/font';
import { TabNavigation } from '@/app/_components/tab-navigations/TabNavigation';
import ToastProvider from './_components/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'TheHabit - 습관 관리 앱',
  description: '당신의 습관을 체계적으로 관리하는 Progressive Web App',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TheHabit',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#000000',
  icons: {
    icon: [
      {
        url: '/images/icons/manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/images/icons/manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/images/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='ko'>
      <head>
        <meta name='application-name' content='TheHabit' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='TheHabit' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='msapplication-config' content='/browserconfig.xml' />
        <meta name='msapplication-TileColor' content='#000000' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta name='theme-color' content='#000000' />
      </head>
      <body
        className={`${pretendard.variable} ${pretendard.variable} antialiased mobile-container`}
      >
        <div className='mobile-wrapper'>
          <NextAuthSessionProvider>
            <Header />
            <QueryProvider>
              <ModalProvider>
                {children}
                <TabNavigation/>
                <ToastProvider />
              </ModalProvider>
            </QueryProvider>
          </NextAuthSessionProvider>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
