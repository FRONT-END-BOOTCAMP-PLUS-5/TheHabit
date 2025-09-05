import { INotificationRepository } from '@/backend/notifications/domain/repositories/INotificationRepository';
import { Notification } from '@/backend/notifications/domain/entities/Notification';

export interface CreateNotificationRequest {
  type: string;
  title: string;
  message: string;
  userId: string;
  fromUserId?: string;
  metadata?: any;
}

export class CreateNotificationUsecase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(request: CreateNotificationRequest): Promise<Notification> {
    try {
      if (!request.userId || request.userId.trim() === '') {
        throw new Error('사용자 ID가 제공되지 않았습니다.');
      }

      if (!request.type || request.type.trim() === '') {
        throw new Error('알림 타입이 제공되지 않았습니다.');
      }

      if (!request.title || request.title.trim() === '') {
        throw new Error('알림 제목이 제공되지 않았습니다.');
      }

      if (!request.message || request.message.trim() === '') {
        throw new Error('알림 내용이 제공되지 않았습니다.');
      }

      const notification = new Notification(
        request.type.trim(),
        request.title.trim(),
        request.message.trim(),
        request.userId.trim(),
        false,
        request.fromUserId?.trim() || null,
        request.metadata || null
      );

      const createdNotification = await this.notificationRepo.create(notification);
      return createdNotification;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`알림 생성 실패: ${error.message}`);
      }
      throw new Error('알림 생성에 실패했습니다.');
    }
  }
}