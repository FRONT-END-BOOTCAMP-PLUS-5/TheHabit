import { Notification } from '@/backend/notifications/domains/entities/Notification';

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findByUserId(userId: string): Promise<Notification[]>;
  findById(id: number): Promise<Notification | null>;
  markAsRead(id: number): Promise<Notification | null>;
  markAllAsReadByUserId(userId: string): Promise<number>;
}