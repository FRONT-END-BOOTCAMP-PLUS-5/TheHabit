import { NextRequest, NextResponse } from 'next/server';
import { GetUserUsecase } from '@/backend/users/applications/usecases/GetUserUsecase';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { UserProfileDto } from '@/backend/users/applications/dtos/UserProfileDto';
import { UserProfileDtoMapper } from '@/backend/users/applications/dtos/UserProfileDtoMapper';
import { AxiosError } from 'axios';

const repository = new PrUserRepository();
const getUserUsecase = new GetUserUsecase(repository);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userNickname: string }> }
): Promise<NextResponse<ApiResponse<UserProfileDto>>> {
  try {
    const { userNickname } = await params;

    if (!userNickname) {
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

    // 유스케이스를 통해 닉네임으로 유저 정보 조회
    const user = await getUserUsecase.execute(userNickname);

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
    if (error instanceof AxiosError) {
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
