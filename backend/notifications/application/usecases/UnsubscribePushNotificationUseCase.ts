import { IPushSubscriptionRepository } from '@/backend/notifications/domain/repositories/IPushSubscriptionRepository';
import { UnsubscribePushNotificationRequestDto } from '@/backend/notifications/application/dtos/PushSubscriptionDto';

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