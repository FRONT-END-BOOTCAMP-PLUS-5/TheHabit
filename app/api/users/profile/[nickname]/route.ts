import { NextRequest, NextResponse } from 'next/server';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { UserProfileDto } from '@/backend/users/applications/dtos/UserProfileDto';
import { UserProfileDtoMapper } from '@/backend/users/applications/dtos/UserProfileDtoMapper';

const repository = new PrUserRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: { nickname: string } }
): Promise<NextResponse<ApiResponse<UserProfileDto>> | undefined> {
  try {
    const { nickname } = await params;

    if (!nickname) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_NICKNAME',
            message: '사용자 닉네임이 필요합니다.',
          },
        },
        { status: 400 }
      );
    }

    // 닉네임으로 유저 정보 조회
    const user = await repository.findByNickname(nickname);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: '해당 닉네임의 사용자를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    // UserProfileDto로 변환 (필요한 필드만)
    const userProfileDto = UserProfileDtoMapper.fromEntity(user);

    return NextResponse.json(
      {
        success: true,
        data: userProfileDto,
        message: '유저 프로필 정보를 성공적으로 조회했습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('유저 프로필 조회 실패:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PROFILE_FETCH_FAILED',
          message: '유저 프로필 정보 조회에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
