import prisma from '@/public/utils/prismaClient';
import { IPushSubscriptionRepository } from '@/backend/notifications/domains/repositories/IPushSubscriptionRepository';
import { PushSubscription } from '@/backend/notifications/domains/entities/PushSubscription';

export class PrPushSubscriptionRepository implements IPushSubscriptionRepository {
  async create(subscription: Omit<PushSubscription, 'id' | 'createdAt'>): Promise<PushSubscription> {
    const createdSubscription = await prisma.push_subscriptions.create({
      data: {
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
        user_id: subscription.userId,
      },
    });

    return new PushSubscription(
      createdSubscription.id,
      createdSubscription.endpoint,
      createdSubscription.p256dh,
      createdSubscription.auth,
      createdSubscription.user_id,
      createdSubscription.created_at
    );
  }

  async findByEndpoint(endpoint: string): Promise<PushSubscription | null> {
    const subscription = await prisma.push_subscriptions.findUnique({
      where: { endpoint },
    });

    if (!subscription) return null;

    return new PushSubscription(
      subscription.id,
      subscription.endpoint,
      subscription.p256dh,
      subscription.auth,
      subscription.user_id,
      subscription.created_at
    );
  }

  async findByUserId(userId: string): Promise<PushSubscription[]> {
    const subscriptions = await prisma.push_subscriptions.findMany({
      where: { user_id: userId },
    });

    return subscriptions.map(
      subscription =>
        new PushSubscription(
          subscription.id,
          subscription.endpoint,
          subscription.p256dh,
          subscription.auth,
          subscription.user_id,
          subscription.created_at
        )
    );
  }

  async deleteByEndpoint(endpoint: string): Promise<boolean> {
    try {
      await prisma.push_subscriptions.delete({
        where: { endpoint },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByUserIdAndEndpoint(userId: string, endpoint: string): Promise<boolean> {
    try {
      const result = await prisma.push_subscriptions.deleteMany({
        where: {
          user_id: userId,
          endpoint: endpoint,
        },
      });
      return result.count > 0;
    } catch (error) {
      return false;
    }
  }
}