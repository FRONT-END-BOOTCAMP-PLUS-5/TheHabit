import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrNotificationRepository } from '@/backend/notifications/infrastructures/repositories/PrNotificationRepository';
import { GetNotificationsByUserIdUsecase } from '@/backend/notifications/applications/usecases/GetNotificationsByUserIdUsecase';
import { MarkAllNotificationsAsReadUsecase } from '@/backend/notifications/applications/usecases/MarkAllNotificationsAsReadUsecase';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { Notification } from '@/backend/notifications/domains/entities/Notification';

const repository = new PrNotificationRepository();

const createGetNotificationsByUserId = () => {
  return new GetNotificationsByUserIdUsecase(repository);
};

const createMarkAllNotificationsAsRead = () => {
  return new MarkAllNotificationsAsReadUsecase(repository);
};

type NotificationsResponse = ApiResponse<Notification[]>;
type MarkAllAsReadResponse = ApiResponse<{ count: number }>;

export async function GET(): Promise<NextResponse<NotificationsResponse>> {
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

    const usecase = createGetNotificationsByUserId();
    const notifications = await usecase.execute(session.user.id);

    return NextResponse.json(
      {
        success: true,
        data: notifications,
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
            code: error.message || 'GET_FAILED',
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
          code: 'GET_FAILED',
          message: 'fail',
        },
      },
      { status: 500 }
    );
  }
}

export async function PATCH(): Promise<NextResponse<MarkAllAsReadResponse>> {
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

    const usecase = createMarkAllNotificationsAsRead();
    const count = await usecase.execute(session.user.id);

    return NextResponse.json(
      {
        success: true,
        data: { count },
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