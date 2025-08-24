import { IPushSubscriptionRepository } from '@/backend/notifications/domains/repositories/IPushSubscriptionRepository';
import { UnsubscribePushNotificationRequestDto } from '@/backend/notifications/applications/dtos/PushSubscriptionDto';

export class UnsubscribePushNotificationUseCase {
  constructor(private readonly pushSubscriptionRepository: IPushSubscriptionRepository) {}

  async execute(request: UnsubscribePushNotificationRequestDto): Promise<boolean> {
    // 사용자 ID와 엔드포인트로 구독 해제
    const isDeleted = await this.pushSubscriptionRepository.deleteByUserIdAndEndpoint(
      request.userId,
      request.endpoint
    );

    return isDeleted;
  }
}