import { NotificationSettings } from '@/app/_components/notifications/NotificationSettings';
import { NotificationList } from '@/app/_components/notifications/NotificationList';

export default function NotificationsPage() {
  return (
    <main className="px-5">
      <section className="mt-10">
        <h1 className="text-4xl font-bold mb-10 text-center">알림</h1>
        
        <div className="mb-8">
          <NotificationSettings />
        </div>

        <div>
          <NotificationList />
        </div>
      </section>
    </main>
  );
}