import { IRoutinesRepository } from '@/backend/routines/domains/repositories/IRoutinesRepository';
import { IChallengeRepository } from '@/backend/challenges/domains/repositories/IChallengeRepository';
import { SendPushNotificationUseCase } from '@/backend/notifications/applications/usecases/SendPushNotificationUseCase';
import { NotificationPayload } from '@/backend/notifications/domains/services/IPushNotificationService';

export class ProcessRoutineAlertsUseCase {
  constructor(
    private readonly routinesRepository: IRoutinesRepository,
    private readonly challengeRepository: IChallengeRepository,
    private readonly sendPushNotificationUseCase: SendPushNotificationUseCase,
  ) {}

  async execute(): Promise<void> {
    const now = new Date();
    const currentMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    
    console.log(`현재 체크하는 시간: ${currentMinute.toISOString()}`);

    const routinesToAlert = await this.routinesRepository.findByAlertTime(currentMinute);
    console.log(`찾은 루틴 개수: ${routinesToAlert.length}`);

    for (const routine of routinesToAlert) {
      if (!routine.challengeId) continue;

      const challenge = await this.challengeRepository.findById(routine.challengeId);
      if (!challenge || !challenge.userId) continue;

      const payload: NotificationPayload = {
        title: '오늘의 루틴을 실천할 시간이에요! 💪',
        body: routine.routineTitle,
        icon: '/icons/icon-192x192.png',
        data: {
          type: 'routine_alert',
          routineId: String(routine.id),
          challengeId: String(challenge.id),
        },
      };

      try {
        await this.sendPushNotificationUseCase.execute(challenge.userId, payload);
        console.log(`Successfully sent routine alert for routine "${routine.routineTitle}" to user ${challenge.userId}`);
      } catch (error) {
        console.error(`Failed to send routine alert for routine "${routine.routineTitle}" to user ${challenge.userId}`, error);
      }
    }
  }
}
