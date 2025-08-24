import { NextRequest, NextResponse } from 'next/server';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { DeleteUserUsecase } from '@/backend/users/applications/usecases/DeleteUserUsecase';
import { GetUserChallengeAndRoutineAndFollowAndCompletion } from '@/backend/users/applications/usecases/GetUserChallengeAndRoutineAndFollowAndCompletion';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import {
  UserChallengeAndRoutineAndFollowAndCompletionDto,
  UserChallengeAndRoutineAndFollowAndCompletionDtoMapper,
} from '@/backend/users/applications/dtos/UserChallengeAndRoutineAndFollowAndCompletion';

const repository = new PrUserRepository();

const createDeleteUser = () => {
  return new DeleteUserUsecase(repository);
};

const createGetUserChallengeAndRoutineAndFollowAndCompletion = () => {
  return new GetUserChallengeAndRoutineAndFollowAndCompletion(repository);
};

type UserResponse = ApiResponse<UserChallengeAndRoutineAndFollowAndCompletionDto>;

export async function GET(
  request: NextRequest,
  { params }: { params: { nickname: string } }
): Promise<NextResponse<UserResponse> | undefined> {
  try {
    const { nickname } = params;
    if (!nickname) {
      throw new Error('사용자 닉네임이 존재하지 않습니다!');
    }

    const usecase = createGetUserChallengeAndRoutineAndFollowAndCompletion();
    const userJoinData = await usecase.execute(nickname);

    if (!userJoinData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '유저 챌린지, 팔로워, 팔로잉, 루틴을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: UserChallengeAndRoutineAndFollowAndCompletionDtoMapper.fromEntity(userJoinData),
        message: 'success',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
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
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { nickname: string } }
): Promise<NextResponse | undefined> {
  try {
    const { nickname } = params;

    if (!nickname) throw new Error('사용자 닉네임이 존재하지 않습니다!');

    const usecase = createDeleteUser();
    const deletedUserRegister = await usecase.execute(nickname);

    return NextResponse.json(
      {
        success: true,
        data: deletedUserRegister,
        message: 'success',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.message || 'DELETE_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}
