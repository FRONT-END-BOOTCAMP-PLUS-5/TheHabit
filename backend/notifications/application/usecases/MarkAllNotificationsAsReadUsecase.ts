import { INotificationRepository } from '@/backend/notifications/domain/repositories/INotificationRepository';

export class MarkAllNotificationsAsReadUsecase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<number> {
    try {
      if (!userId || userId.trim() === '') {
        throw new Error('사용자 ID가 제공되지 않았습니다.');
      }

      const count = await this.notificationRepo.markAllAsReadByUserId(userId.trim());
      return count;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`모든 알림 읽음 처리 실패: ${error.message}`);
      }
      throw new Error('모든 알림 읽음 처리에 실패했습니다.');
    }
  }
}