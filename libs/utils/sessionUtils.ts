import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { NextRequest, NextResponse } from 'next/server';
import { UserDto } from '@/backend/users/applications/dtos/UserDto';

export async function getSessionUser(request?: NextRequest): Promise<UserDto | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return null;
    }
    return {
      id: session.user.id,
      username: session.user.username,
      nickname: session.user.nickname,
      email: session.user.email,
      profileImg: session.user.profileImg,
      profileImgPath: session.user.profileImgPath,
    };
  } catch (error) {
    console.error('세션 정보 조회 오류:', error);
    return null;
  }
}

// 인증되지 않은 사용자에 대한 에러 응답 생성

export function createUnauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '로그인이 필요합니다.',
      },
    },
    { status: 401 }
  );
}

// 세션에서 사용자 ID를 가져오고, 없으면 에러 응답 반환
export async function getSessionUserIdOrError(request?: NextRequest): Promise<{
  userId: string | null;
  errorResponse: NextResponse | null;
}> {
  const user: UserDto | null = await getSessionUser(request);
  if (!user?.id) {
    return {
      userId: null,
      errorResponse: createUnauthorizedResponse(),
    };
  }
  return {
    userId: user.id,
    errorResponse: null,
  };
}
