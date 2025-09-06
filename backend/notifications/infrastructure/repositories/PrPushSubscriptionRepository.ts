import prisma from '@/public/utils/prismaClient';
import { IPushSubscriptionRepository } from '@/backend/notifications/domain/repositories/IPushSubscriptionRepository';
import { PushSubscription } from '@/backend/notifications/domain/entities/PushSubscription';

export class PrPushSubscriptionRepository implements IPushSubscriptionRepository {
  async create(
    subscription: Omit<PushSubscription, 'id' | 'createdAt'>
  ): Promise<PushSubscription> {
    const createdSubscription = await prisma.pushSubscription.create({
      data: {
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
        userId: subscription.userId,
      },
    });

    return new PushSubscription(
      createdSubscription.id,
      createdSubscription.endpoint,
      createdSubscription.p256dh,
      createdSubscription.auth,
      createdSubscription.userId,
      createdSubscription.createdAt
    );
  }

  async findByEndpoint(endpoint: string): Promise<PushSubscription | null> {
    const subscription = await prisma.pushSubscription.findUnique({
      where: { endpoint },
    });

    if (!subscription) return null;

    return new PushSubscription(
      subscription.id,
      subscription.endpoint,
      subscription.p256dh,
      subscription.auth,
      subscription.userId,
      subscription.createdAt
    );
  }

  async findByUserId(userId: string | null): Promise<PushSubscription[]> {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    return subscriptions.map(
      subscription =>
        new PushSubscription(
          subscription.id,
          subscription.endpoint,
          subscription.p256dh,
          subscription.auth,
          subscription.userId,
          subscription.createdAt
        )
    );
  }

  async deleteByEndpoint(endpoint: string): Promise<boolean> {
    try {
      await prisma.pushSubscription.delete({
        where: { endpoint },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByUserIdAndEndpoint(userId: string | null, endpoint: string): Promise<boolean> {
    try {
      console.log('🗑️ 구독 해제 시도:', { userId, endpoint: endpoint.substring(0, 50) + '...' });

      // 먼저 해당 구독이 존재하는지 확인
      const existingSubscription = await prisma.pushSubscription.findFirst({
        where: {
          userId,
          endpoint,
        },
      });

      console.log('🔍 기존 구독 찾기 결과:', existingSubscription ? '존재함' : '없음');

      const result = await prisma.pushSubscription.deleteMany({
        where: {
          userId,
          endpoint,
        },
      });

      console.log('🗑️ 삭제 결과:', { count: result.count });
      return result.count > 0;
    } catch (error) {
      console.error('🚨 구독 해제 중 오류:', error);
      return false;
    }
  }
}
