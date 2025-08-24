import { NextRequest, NextResponse } from 'next/server';
import { PrFollowRepository } from '@/backend/follows/infrastructures/repositories/PrFollowRepository';
import { GetFollowingByToUserIdUsecase } from '@/backend/follows/applications/usecases/GetFollowingByFromUserIdUsecase';
import { AddFollowingUsecase } from '@/backend/follows/applications/usecases/AddFollowingUsecase';
import { DeleteUnfollowUsecase } from '@/backend/follows/applications/usecases/DeleteUnfollowUsecase';
import { SendPushNotificationUseCase } from '@/backend/notifications/applications/usecases/SendPushNotificationUseCase';
import { PrPushSubscriptionRepository } from '@/backend/notifications/infrastructures/repositories/PrPushSubscriptionRepository';
import { WebPushNotificationService } from '@/backend/notifications/infrastructures/services/WebPushNotificationService';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';

const repository = new PrFollowRepository();

const createGetFollowingByFromUserIdUsecase = () => {
  return new GetFollowingByToUserIdUsecase(repository);
};

const createAddFollowingUsecase = () => {
  return new AddFollowingUsecase(repository);
};

const createDeleteUnfollowUsecase = () => {
  return new DeleteUnfollowUsecase(repository);
};

export async function GET(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const fromUserId = request.nextUrl.searchParams.get('fromUserId');
    const keyword = request.nextUrl.searchParams.get('keyword');

    if (!fromUserId) throw new Error('사용자 아이디가 존재하지 않습니다!');

    const usecase = createGetFollowingByFromUserIdUsecase();
    const followers = await usecase.execute(fromUserId, keyword || '');

    return NextResponse.json(
      {
        success: true,
        data: followers,
        message: 'success',
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: err.message || 'GET_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const { fromUserId, toUserId } = await request.json();

    if (!fromUserId) throw new Error('사용자 아이디가 존재하지 않습니다!');
    if (!toUserId) throw new Error('팔로잉 할려는 유저의 아이디가 존재하지 않습니다!');

    const usecase = createAddFollowingUsecase();
    const addfollowing = await usecase.execute(fromUserId, toUserId);

    // 팔로우 성공 시 알림 전송
    if (addfollowing) {
      try {
        const userRepository = new PrUserRepository();
        const pushSubscriptionRepository = new PrPushSubscriptionRepository();
        const pushNotificationService = new WebPushNotificationService();
        
        const sendNotificationUseCase = new SendPushNotificationUseCase(
          pushSubscriptionRepository,
          pushNotificationService
        );
        
        // 팔로우한 사용자 정보 가져오기
        const fromUser = await userRepository.findById(fromUserId);
        
        if (fromUser) {
          await sendNotificationUseCase.execute(toUserId, {
            title: '새로운 팔로워',
            body: `${fromUser.nickname}님이 당신을 팔로우했습니다!`,
            icon: '/images/icons/notification-icon.png',
            data: {
              type: 'follow',
              userId: fromUserId,
            }
          });
        }
      } catch (notificationError) {
        // 알림 전송 실패해도 팔로우는 성공으로 처리
        console.error('팔로우 알림 전송 실패:', notificationError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: addfollowing,
        message: 'follow',
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: err.message || '팔로잉 실패',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const { fromUserId, toUserId } = await request.json();

    if (!fromUserId) throw new Error('사용자 아이디가 존재하지 않습니다!');
    if (!toUserId) throw new Error('언팔로우 할려는 유저의 아이디가 존재하지 않습니다!');

    const usecase = createDeleteUnfollowUsecase();
    const unfollow = await usecase.execute(fromUserId, toUserId);

    return NextResponse.json(
      {
        success: true,
        data: unfollow,
        message: 'unfollow',
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: err.message || 'GET_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}
