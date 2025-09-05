import { NextRequest, NextResponse } from 'next/server';
import { GetUserRoutineCompletion } from '@/backend/users/application/usecases/GetUserRoutineCompletion';
import { PrUserRepository } from '@/backend/users/infrastructure/repositories/PrUserRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { RoutineCompletionDto } from '@/backend/routine-completions/application/dtos/RoutineCompletionDto';

const repository = new PrUserRepository();

const createGetUserRoutineCompletion = () => {
  return new GetUserRoutineCompletion(repository);
};

type RoutineCompletions = ApiResponse<RoutineCompletionDto[]>;

export async function GET(
  request: NextRequest
): Promise<NextResponse<RoutineCompletions> | undefined> {
  try {
    const nickname = request.nextUrl.searchParams.get('nickname');
    const pageParam = request.nextUrl.searchParams.get('pageParam');
    const pageSize = request.nextUrl.searchParams.get('pageSize');
    const categoryid = request.nextUrl.searchParams.get('categoryId');

    if (!nickname) throw new Error('사용자 닉네임이 존재하지 않습니다!');

    const usecase = createGetUserRoutineCompletion();
    const userRoutineCompletion = await usecase.execute(
      nickname,
      pageParam || '1',
      pageSize || '3',
      categoryid || 'All'
    );

    const processedCompletions = (userRoutineCompletion || []).map(completion => ({
      id: completion.id,
      routineId: completion.routineId,
      createdAt: completion.createdAt.toISOString(),
      proofImgUrl: completion.proofImgUrl,
      content: completion.content,
    }));

    return NextResponse.json(
      {
        success: true,
        data: processedCompletions,
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
            code: error.message || 'GET_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}
