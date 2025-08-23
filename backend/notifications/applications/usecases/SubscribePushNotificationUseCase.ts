import { IPushSubscriptionRepository } from '@/backend/notifications/domains/repositories/IPushSubscriptionRepository';
import { 
  CreatePushSubscriptionRequestDto, 
  PushSubscriptionDto, 
  PushSubscriptionDtoMapper 
} from '@/backend/notifications/applications/dtos/PushSubscriptionDto';

export class SubscribePushNotificationUseCase {
  constructor(private readonly pushSubscriptionRepository: IPushSubscriptionRepository) {}

  async execute(request: CreatePushSubscriptionRequestDto): Promise<PushSubscriptionDto> {
    // 1. 이미 존재하는 구독인지 확인
    const existingSubscription = await this.pushSubscriptionRepository.findByEndpoint(request.endpoint);
    
    if (existingSubscription) {
      // 이미 구독되어 있으면 기존 구독을 DTO로 변환해서 반환
      return PushSubscriptionDtoMapper.fromEntity(existingSubscription);
    }

    // 2. 새로운 구독 생성
    const newSubscription = await this.pushSubscriptionRepository.create({
      endpoint: request.endpoint,
      p256dh: request.p256dh,
      auth: request.auth,
      userId: request.userId,
    });

    return PushSubscriptionDtoMapper.fromEntity(newSubscription);
  }
}