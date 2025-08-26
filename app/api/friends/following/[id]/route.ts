import { NextRequest, NextResponse } from 'next/server';
import { PrFollowRepository } from '@/backend/follows/infrastructures/repositories/PrFollowRepository';
import { GetFollowingByToUserIdUsecase } from '@/backend/follows/applications/usecases/GetFollowingByFromUserIdUsecase';
import { AddFollowingUsecase } from '@/backend/follows/applications/usecases/AddFollowingUsecase';
import { DeleteUnfollowUsecase } from '@/backend/follows/applications/usecases/DeleteUnfollowUsecase';
import { PrNotificationRepository } from '@/backend/notifications/infrastructures/repositories/PrNotificationRepository';
import { CreateNotificationUsecase } from '@/backend/notifications/applications/usecases/CreateNotificationUsecase';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { GetUserUsecase } from '@/backend/users/applications/usecases/GetUserUsecase';

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
