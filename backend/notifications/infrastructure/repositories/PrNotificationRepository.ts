import prisma from '@/public/utils/prismaClient';
import { INotificationRepository } from '@/backend/notifications/domain/repositories/INotificationRepository';
import { Notification } from '@/backend/notifications/domain/entities/Notification';

export class PrNotificationRepository implements INotificationRepository {
  async create(notification: Notification): Promise<Notification> {
    try {
      const created = await prisma.notification.create({
        data: {
          type: notification.type,
          title: notification.title,
          message: notification.message,
          userId: notification.userId,
          fromUserId: notification.fromUserId,
          metadata: notification.metadata,
          isRead: notification.isRead,
        },
      });

      return new Notification(
        created.type,
        created.title,
        created.message,
        created.userId,
        created.isRead,
        created.fromUserId,
        created.metadata,
        created.id,
        created.createdAt
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('알림 생성에 실패했습니다.');
    }
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return notifications.map(
        (n) =>
          new Notification(
            n.type,
            n.title,
            n.message,
            n.userId,
            n.isRead,
            n.fromUserId,
            n.metadata,
            n.id,
            n.createdAt
          )
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('사용자 알림 조회에 실패했습니다.');
    }
  }

  async findById(id: number): Promise<Notification | null> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) return null;

      return new Notification(
        notification.type,
        notification.title,
        notification.message,
        notification.userId,
        notification.isRead,
        notification.fromUserId,
        notification.metadata,
        notification.id,
        notification.createdAt
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('알림 조회에 실패했습니다.');
    }
  }

  async markAsRead(id: number): Promise<Notification | null> {
    try {
      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      return new Notification(
        updated.type,
        updated.title,
        updated.message,
        updated.userId,
        updated.isRead,
        updated.fromUserId,
        updated.metadata,
        updated.id,
        updated.createdAt
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('알림 읽음 처리에 실패했습니다.');
    }
  }

  async markAllAsReadByUserId(userId: string): Promise<number> {
    try {
      const result = await prisma.notification.updateMany({
        where: { 
          userId,
          isRead: false 
        },
        data: { isRead: true },
      });

      return result.count;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('모든 알림 읽음 처리에 실패했습니다.');
    }
  }
}