import { PushSubscription } from '@/backend/notifications/domain/entities/PushSubscription';

export interface IPushSubscriptionRepository {
  // 새로운 구독 생성
  create(subscription: Omit<PushSubscription, 'id' | 'createdAt'>): Promise<PushSubscription>;
  
  // endpoint로 기존 구독 찾기 (중복 체크용)
  findByEndpoint(endpoint: string): Promise<PushSubscription | null>;
  
  // 사용자ID로 모든 구독 찾기
  findByUserId(userId: string | null): Promise<PushSubscription[]>;
  
  // endpoint로 구독 삭제
  deleteByEndpoint(endpoint: string): Promise<boolean>;
  
  // 사용자ID + endpoint로 구독 삭제
  deleteByUserIdAndEndpoint(userId: string | null, endpoint: string): Promise<boolean>;
}