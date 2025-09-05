import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrNotificationRepository } from '@/backend/notifications/infrastructures/repositories/PrNotificationRepository';
import { MarkNotificationAsReadUsecase } from '@/backend/notifications/applications/usecases/MarkNotificationAsReadUsecase';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { Notification } from '@/backend/notifications/domains/entities/Notification';

const repository = new PrNotificationRepository();

const createMarkNotificationAsRead = () => {
  return new MarkNotificationAsReadUsecase(repository);
};

type NotificationResponse = ApiResponse<Notification>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<NotificationResponse>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증되지 않은 사용자입니다.',
          },
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const notificationId = parseInt(id, 10);

    if (isNaN(notificationId) || notificationId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: '유효하지 않은 알림 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    const usecase = createMarkNotificationAsRead();
    const notification = await usecase.execute(notificationId);

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '알림을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: notification,
        message: 'success',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.message || 'PATCH_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PATCH_FAILED',
          message: 'fail',
        },
      },
      { status: 500 }
    );
  }
}