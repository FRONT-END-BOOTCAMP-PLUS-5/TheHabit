import webPush from 'web-push';
import {
  IPushNotificationService,
  NotificationPayload,
} from '@/backend/notifications/domain/services/IPushNotificationService';

export class WebPushNotificationService implements IPushNotificationService {
  constructor() {
    webPush.setVapidDetails(
      'mailto:support@thehabit.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
      process.env.VAPID_PRIVATE_KEY || ''
    );
  }

  async send(
    endpoint: string,
    p256dh: string,
    auth: string,
    payload: NotificationPayload
  ): Promise<void> {
    const pushSubscription = {
      endpoint,
      keys: { p256dh, auth },
    };

    await webPush.sendNotification(pushSubscription, JSON.stringify(payload));
  }
}
