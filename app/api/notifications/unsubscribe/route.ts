import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrPushSubscriptionRepository } from '@/backend/notifications/infrastructure/repositories/PrPushSubscriptionRepository';
import { UnsubscribePushNotificationUseCase } from '@/backend/notifications/application/usecases/UnsubscribePushNotificationUseCase';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

// Repository와 UseCase 인스턴스 생성
const pushSubscriptionRepository = new PrPushSubscriptionRepository();

const createUnsubscribePushNotificationUseCase = () => {
  return new UnsubscribePushNotificationUseCase(pushSubscriptionRepository);
};

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
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
    const { endpoint } = await request.json();

    // 3. 필수 데이터 검증
    if (!endpoint) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_ENDPOINT',
          message: '구독 해제할 엔드포인트가 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 4. UseCase 실행
    const useCase = createUnsubscribePushNotificationUseCase();
    const isUnsubscribed = await useCase.execute({
      endpoint,
      userId: session.user.id
    });

    if (!isUnsubscribed) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'SUBSCRIPTION_NOT_FOUND',
          message: '구독 정보를 찾을 수 없습니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // 5. 성공 응답
    const successResponse: ApiResponse<null> = {
      success: true,
      data: null,
      message: '푸시 알림 구독이 해제되었습니다.'
    };
    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('푸시 알림 구독 해제 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'UNSUBSCRIPTION_FAILED',
        message: '푸시 알림 구독 해제에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}