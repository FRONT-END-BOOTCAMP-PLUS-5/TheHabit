import { IPushSubscriptionRepository } from '@/backend/notifications/domains/repositories/IPushSubscriptionRepository';

export interface UnsubscribePushNotificationRequest {
  endpoint: string;
  userId: string;
}

export class UnsubscribePushNotificationUseCase {
  constructor(private readonly pushSubscriptionRepository: IPushSubscriptionRepository) {}

  async execute(request: UnsubscribePushNotificationRequest): Promise<boolean> {
    // 사용자ID + endpoint로 구독 삭제
    const isDeleted = await this.pushSubscriptionRepository.deleteByUserIdAndEndpoint(
      request.userId,
      request.endpoint
    );

    return isDeleted;
  }
}