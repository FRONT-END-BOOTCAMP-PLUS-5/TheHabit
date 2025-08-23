import { IPushSubscriptionRepository } from '@/backend/notifications/domains/repositories/IPushSubscriptionRepository';
import { PushSubscription } from '@/backend/notifications/domains/entities/PushSubscription';

export interface SubscribePushNotificationRequest {
  endpoint: string;
  p256dh: string;
  auth: string;
  userId: string;
}

export class SubscribePushNotificationUseCase {
  constructor(private readonly pushSubscriptionRepository: IPushSubscriptionRepository) {}

  async execute(request: SubscribePushNotificationRequest): Promise<PushSubscription> {
    // 1. 이미 존재하는 구독인지 확인
    const existingSubscription = await this.pushSubscriptionRepository.findByEndpoint(request.endpoint);
    
    if (existingSubscription) {
      // 이미 구독되어 있으면 기존 구독 반환
      return existingSubscription;
    }

    // 2. 새로운 구독 생성
    const newSubscription = await this.pushSubscriptionRepository.create({
      endpoint: request.endpoint,
      p256dh: request.p256dh,
      auth: request.auth,
      userId: request.userId,
    });

    return newSubscription;
  }
}