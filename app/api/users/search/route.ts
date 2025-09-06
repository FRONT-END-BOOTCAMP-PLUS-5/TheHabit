import { NextRequest, NextResponse } from 'next/server';
import { PrUserRepository } from '@/backend/users/infrastructure/repositories/PrUserRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { GetUsersUsecase } from '@/backend/users/application/usecases/GetUsersUsecase';
import { UserDto } from '@/backend/users/application/dtos/UserDto';
import { GetFollowingByToUserIdUsecase } from '@/backend/follows/application/usecases/GetFollowingByFromUserIdUsecase';
import { PrFollowRepository } from '@/backend/follows/infrastructure/repositories/PrFollowRepository';
const userRepository = new PrUserRepository();
const followRepository = new PrFollowRepository();

const createGetUsers = () => {
  return new GetUsersUsecase(userRepository);
};

// 와 코드 짜다가 바지에 지림;
// 미안하다 이거보여줄려고 어그로 끌었다...
// 어쩔 수 없이 여기다 해야함...
// 그리고 왜 아이디로 하냐... 이거이거 컬럼 제작할때 누군가 AI한테 다시 물어봐서
// from_user_id, to_user_id 이걸로 강제로 되어버렸다...
// 친구 페이지는 팔로윙을 할꺼라서 following, unfollow 이거는 follow 쪽에 있어서..
const createGetFollowingByFromUserIdUsecase = () => {
  return new GetFollowingByToUserIdUsecase(followRepository);
};

type UserResponse = ApiResponse<UserDto[]>;

export async function GET(request: NextRequest): Promise<NextResponse<UserResponse>> {
  try {
    const username = request.nextUrl.searchParams.get('username');
    const myNickname = request.nextUrl.searchParams.get('myNickname');
    const fromUserId = request.nextUrl.searchParams.get('fromUserId');

    const userUsecase = createGetUsers();
    const followingUsecase = createGetFollowingByFromUserIdUsecase();

    const [users, followingData] = await Promise.all([
      userUsecase.execute(username || '', myNickname || ''),
      followingUsecase.execute(fromUserId || '', username || ''),
    ]);

    const validUsers = users || [];
    const validFollowing = followingData?.following || [];

    const followingUserIds = new Set(validFollowing.map(f => f.toUser.id));

    const processedUsers = validUsers.map(user => {
      const isFollowing = followingUserIds.has(user?.id || '');

      return {
        ...user,
        isFollowing: isFollowing,
        createdAt: user?.createdAt?.toISOString(),
        updatedAt: user?.updatedAt?.toISOString(),
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: processedUsers,
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
          code: 'UNKNOWN_ERROR',
          message: '알 수 없는 에러가 떴어요',
        },
      },
      { status: 500 }
    );
  }
}
