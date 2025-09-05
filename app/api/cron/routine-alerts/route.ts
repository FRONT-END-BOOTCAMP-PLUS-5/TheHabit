import { NextResponse } from 'next/server';
import { PrRoutinesRepository } from '@/backend/routines/infrastructure/repositories/PrRoutinesRepository';
import { PrChallengeRepository } from '@/backend/challenges/infrastructure/repositories/PrChallengeRepository';
import { PrPushSubscriptionRepository } from '@/backend/notifications/infrastructure/repositories/PrPushSubscriptionRepository';
import { WebPushNotificationService } from '@/backend/notifications/infrastructure/services/WebPushNotificationService';
import { SendPushNotificationUseCase } from '@/backend/notifications/application/usecases/SendPushNotificationUseCase';
import { ProcessRoutineAlertsUseCase } from '@/backend/routines/application/usecases/ProcessRoutineAlertsUseCase';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

// Instantiate repositories and services
const routinesRepository = new PrRoutinesRepository();
const challengeRepository = new PrChallengeRepository();
const pushSubscriptionRepository = new PrPushSubscriptionRepository();
const pushNotificationService = new WebPushNotificationService();

// Factory for SendPushNotificationUseCase
const createSendPushNotificationUseCase = () => {
  return new SendPushNotificationUseCase(pushSubscriptionRepository, pushNotificationService);
};

// Factory for ProcessRoutineAlertsUseCase
const createProcessRoutineAlertsUseCase = () => {
  const sendPushNotificationUseCase = createSendPushNotificationUseCase();
  return new ProcessRoutineAlertsUseCase(routinesRepository, challengeRepository, sendPushNotificationUseCase);
};

export const GET = async (): Promise<NextResponse<ApiResponse<null>>> => {
  console.log('CRON JOB: Starting to process routine alerts...');
  const useCase = createProcessRoutineAlertsUseCase();

  try {
    await useCase.execute();
    console.log('CRON JOB: Finished processing routine alerts.');
    return NextResponse.json({
      success: true,
      message: '루틴 알림 처리를 성공적으로 완료했습니다.',
      data: null,
    });
  } catch (error) {
    console.error('CRON JOB: Error processing routine alerts:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '루틴 알림 처리 중 오류가 발생했습니다.',
        },
      },
      { status: 500 },
    );
  }
};
