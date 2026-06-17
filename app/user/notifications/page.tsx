import { NotificationsPageContent } from './components/NotificationsPageContent';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/app/_components/loading/LoadingSpinner';

export default function NotificationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NotificationsPageContent />
    </Suspense>
  );
}
