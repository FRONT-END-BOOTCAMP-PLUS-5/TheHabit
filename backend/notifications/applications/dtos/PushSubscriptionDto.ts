import { PushSubscription } from '@/backend/notifications/domains/entities/PushSubscription';

// PushSubscription DTO (Data Transfer Object) Interface
export interface PushSubscriptionDto {
  readonly id: number;
  readonly endpoint: string;
  readonly userId: string | null;
  readonly createdAt: string;
}

// 구독 생성 요청 DTO
export interface CreatePushSubscriptionRequestDto {
  readonly endpoint: string;
  readonly p256dh: string;
  readonly auth: string;
  readonly userId: string;
}

// 구독 해제 요청 DTO
export interface UnsubscribePushNotificationRequestDto {
  readonly endpoint: string;
  readonly userId: string | null;
}

// PushSubscription Entity에서 DTO로 변환하는 유틸리티 함수들
export class PushSubscriptionDtoMapper {
  static fromEntity(subscription: PushSubscription): PushSubscriptionDto {
    return {
      id: subscription.id,
      endpoint: subscription.endpoint,
      userId: subscription.userId,
      createdAt: subscription.createdAt ? subscription.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  static fromEntities(subscriptions: PushSubscription[]): PushSubscriptionDto[] {
    return subscriptions.map(subscription => this.fromEntity(subscription));
  }
}