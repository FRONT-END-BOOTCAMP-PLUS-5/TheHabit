import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { FcmTokenDto } from '@/backend/notifications/application/dtos/FcmTokenDto';
import { PrFcmTokenRepository } from '@/backend/notifications/infrastructure/repositories/PrFcmTokenRepository';
import { SaveFcmTokenUseCase } from '@/backend/notifications/application/usecases/SaveFcmTokenUseCase';
import { ClearFcmTokenUseCase } from '@/backend/notifications/application/usecases/ClearFcmTokenUseCase';

const fcmTokenRepository = new PrFcmTokenRepository();

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<FcmTokenDto | null>>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' },
        },
        { status: 401 }
      );
    }

    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'MISSING_FCM_TOKEN', message: 'FCM 토큰이 필요합니다.' },
        },
        { status: 400 }
      );
    }

    const useCase = new SaveFcmTokenUseCase(fcmTokenRepository);
    const saved = await useCase.execute({
      token,
      userId: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        data: saved,
        message: 'FCM 토큰이 저장되었습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('FCM 토큰 저장 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'FCM_TOKEN_SAVE_FAILED', message: 'FCM 토큰 저장에 실패했습니다.' },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' },
        },
        { status: 401 }
      );
    }

    const useCase = new ClearFcmTokenUseCase(fcmTokenRepository);
    await useCase.execute(session.user.id);

    return NextResponse.json(
      {
        success: true,
        data: null,
        message: 'FCM 토큰이 삭제되었습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('FCM 토큰 삭제 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'FCM_TOKEN_CLEAR_FAILED', message: 'FCM 토큰 삭제에 실패했습니다.' },
      },
      { status: 500 }
    );
  }
}
