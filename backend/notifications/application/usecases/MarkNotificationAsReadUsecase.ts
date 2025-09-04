import { INotificationRepository } from '@/backend/notifications/domains/repositories/INotificationRepository';
import { Notification } from '@/backend/notifications/domains/entities/Notification';

export class MarkNotificationAsReadUsecase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(id: number): Promise<Notification | null> {
    try {
      if (!id || id <= 0) {
        throw new Error('유효하지 않은 알림 ID입니다.');
      }

      const notification = await this.notificationRepo.markAsRead(id);
      return notification;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`알림 읽음 처리 실패: ${error.message}`);
      }
      throw new Error('알림 읽음 처리에 실패했습니다.');
    }
  }
}