import { INotificationRepository } from '@/backend/notifications/domain/repositories/INotificationRepository';
import { Notification } from '@/backend/notifications/domain/entities/Notification';

export class GetNotificationsByUserIdUsecase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<Notification[]> {
    try {
      if (!userId || userId.trim() === '') {
        throw new Error('사용자 ID가 제공되지 않았습니다.');
      }

      const notifications = await this.notificationRepo.findByUserId(userId.trim());
      return notifications;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`알림 조회 실패: ${error.message}`);
      }
      throw new Error('알림 조회에 실패했습니다.');
    }
  }
}