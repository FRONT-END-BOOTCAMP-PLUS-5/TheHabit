import { NextRequest, NextResponse } from 'next/server';
import { PrFollowRepository } from '@/backend/follows/infrastructure/repositories/PrFollowRepository';
import { GetFollowingByToUserIdUsecase } from '@/backend/follows/application/usecases/GetFollowingByFromUserIdUsecase';
import { AddFollowingUsecase } from '@/backend/follows/application/usecases/AddFollowingUsecase';
import { DeleteUnfollowUsecase } from '@/backend/follows/application/usecases/DeleteUnfollowUsecase';
import { PrNotificationRepository } from '@/backend/notifications/infrastructure/repositories/PrNotificationRepository';
import { CreateNotificationUsecase } from '@/backend/notifications/application/usecases/CreateNotificationUsecase';
import { PrUserRepository } from '@/backend/users/infrastructure/repositories/PrUserRepository';
import { GetUserUsecase } from '@/backend/users/application/usecases/GetUserUsecase';
import { SendPushNotificationUseCase } from '@/backend/notifications/application/usecases/SendPushNotificationUseCase';
import { PrPushSubscriptionRepository } from '@/backend/notifications/infrastructure/repositories/PrPushSubscriptionRepository';
import { WebPushNotificationService } from '@/backend/notifications/infrastructure/services/WebPushNotificationService';

const repository = new PrFollowRepository();
const notificationRepository = new PrNotificationRepository();
const userRepository = new PrUserRepository();

const createGetFollowingByFromUserIdUsecase = () => {
  return new GetFollowingByToUserIdUsecase(repository);
};

const createAddFollowingUsecase = () => {
  return new AddFollowingUsecase(repository);
};

const createDeleteUnfollowUsecase = () => {
  return new DeleteUnfollowUsecase(repository);
};

const createNotificationUsecase = () => {
  return new CreateNotificationUsecase(notificationRepository);
};

const createGetUserUsecase = () => {
  return new GetUserUsecase(userRepository);
};

export async function GET(request: NextRequest): Promise<NextResponse> {
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
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { fromUserId, toUserId } = await request.json();

    if (!fromUserId) throw new Error('사용자 아이디가 존재하지 않습니다!');
    if (!toUserId) throw new Error('팔로잉 할려는 유저의 아이디가 존재하지 않습니다!');

    const usecase = createAddFollowingUsecase();
    const addfollowing = await usecase.execute(fromUserId, toUserId);

    // 팔로우 성공 시 알림 생성
    try {
      const getUserUsecase = createGetUserUsecase();
      const fromUser = await getUserUsecase.execute(fromUserId);

      if (fromUser) {
        const notificationUsecase = createNotificationUsecase();
        await notificationUsecase.execute({
          type: 'follow',
          title: '새로운 팔로워',
          message: `${fromUser.nickname}님이 회원님을 팔로우했습니다.`,
          userId: toUserId,
          fromUserId: fromUserId,
          metadata: {
            fromUserNickname: fromUser.nickname,
            fromUserProfileImg: fromUser.profileImg
          }
        });
      }
    } catch {
      // 알림 생성 실패해도 팔로우는 성공으로 처리
    }

    // 팔로우 성공 시 푸시 알림 전송
    if (addfollowing) {
      try {
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
    if (err instanceof Error) {
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
    return NextResponse.json(
      {
        success: false,
        error: {
          code: '팔로잉 실패',
          message: 'fail',
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
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
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: err.message || '언팔로우 실패',
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
          code: '언팔로우 실패',
          message: 'fail',
        },
      },
      { status: 500 }
    );
  }
}
