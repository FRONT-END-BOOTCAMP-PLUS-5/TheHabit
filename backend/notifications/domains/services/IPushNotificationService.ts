interface NotificationData {
  type: 'follow' | 'routine_completion' | 'routine_alert';
  userId?: string;
  routineId?: string;
  challengeId?: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: NotificationData;
}

export interface IPushNotificationService {
  send(endpoint: string, p256dh: string, auth: string, payload: NotificationPayload): Promise<void>;
}