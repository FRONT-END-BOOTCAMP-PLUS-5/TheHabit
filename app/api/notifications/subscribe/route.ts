import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrPushSubscriptionRepository } from '@/backend/notifications/infrastructures/repositories/PrPushSubscriptionRepository';
import { SubscribePushNotificationUseCase } from '@/backend/notifications/applications/usecases/SubscribePushNotificationUseCase';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { PushSubscriptionDto } from '@/backend/notifications/applications/dtos/PushSubscriptionDto';

// Repository와 UseCase 인스턴스 생성
const pushSubscriptionRepository = new PrPushSubscriptionRepository();

const createSubscribePushNotificationUseCase = () => {
  return new SubscribePushNotificationUseCase(pushSubscriptionRepository);
};

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<PushSubscriptionDto | null>>> {
  try {
    // 1. 사용자 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '로그인이 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // 2. 요청 데이터 파싱
    const { endpoint, p256dh, auth } = await request.json();

    // 3. 필수 데이터 검증
    if (!endpoint || !p256dh || !auth) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_SUBSCRIPTION_DATA',
          message: '구독 데이터가 필요합니다. (endpoint, p256dh, auth)'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 4. UseCase 실행
    const useCase = createSubscribePushNotificationUseCase();
    const subscription = await useCase.execute({
      endpoint,
      p256dh,
      auth,
      userId: session.user.id
    });

    // 5. 성공 응답
    const successResponse: ApiResponse<PushSubscriptionDto> = {
      success: true,
      data: subscription,
      message: '푸시 알림 구독이 완료되었습니다.'
    };
    return NextResponse.json(successResponse, { status: 201 });

  } catch (error) {
    console.error('푸시 알림 구독 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'SUBSCRIPTION_FAILED',
        message: '푸시 알림 구독에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}