import webPush from 'web-push';
import {
  IPushNotificationService,
  NotificationPayload,
} from '@/backend/notifications/domain/services/IPushNotificationService';

export class WebPushNotificationService implements IPushNotificationService {
  private vapidConfigured = false;

  private ensureVapidConfigured(): void {
    if (this.vapidConfigured) return;

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      throw new Error('VAPID keys are not configured');
    }

    webPush.setVapidDetails('mailto:support@thehabit.com', publicKey, privateKey);
    this.vapidConfigured = true;
  }

  async send(
    endpoint: string,
    p256dh: string,
    auth: string,
    payload: NotificationPayload
  ): Promise<void> {
    this.ensureVapidConfigured();

    const pushSubscription = {
      endpoint,
      keys: { p256dh, auth },
    };

    await webPush.sendNotification(pushSubscription, JSON.stringify(payload));
  }
}
