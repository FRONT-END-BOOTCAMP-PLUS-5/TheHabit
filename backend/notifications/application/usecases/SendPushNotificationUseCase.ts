import { IPushSubscriptionRepository } from '@/backend/notifications/domain/repositories/IPushSubscriptionRepository';
import { IPushNotificationService, NotificationPayload } from '@/backend/notifications/domain/services/IPushNotificationService';

export class SendPushNotificationUseCase {
  constructor(
    private readonly pushSubscriptionRepo: IPushSubscriptionRepository,
    private readonly pushNotificationService: IPushNotificationService
  ) {}

  async execute(userId: string | null, payload: NotificationPayload): Promise<void> {
    try {
      const subscriptions = await this.pushSubscriptionRepo.findByUserId(userId);
      
      if (!subscriptions || subscriptions.length === 0) {
        console.log(`사용자 ${userId}의 활성 구독이 없습니다.`);
        return;
      }

      const sendPromises = subscriptions.map(async (subscription) => {
        try {
          await this.pushNotificationService.send(
            subscription.endpoint,
            subscription.p256dh,
            subscription.auth,
            payload
          );
          
          console.log(`알림 전송 성공: ${userId}`);
        } catch (error) {
          console.error(`알림 전송 실패: ${userId}`, error);
          
          // WebPushError의 statusCode가 410 (Gone)이면 만료된 구독
          if (
            (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 410) ||
            (error instanceof Error && error.message.includes('410'))
          ) {
            console.log(`⚠️ 만료된 구독 발견, DB에서 삭제: ${subscription.endpoint.substring(0, 50)}...`);
            await this.pushSubscriptionRepo.deleteByEndpoint(subscription.endpoint);
          }
        }
      });

      await Promise.all(sendPromises);
    } catch (error) {
      console.error('알림 전송 중 오류:', error);
      throw new Error('알림 전송 실패');
    }
  }
}