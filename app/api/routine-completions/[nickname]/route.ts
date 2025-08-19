import { NextRequest, NextResponse } from 'next/server';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

const createGetRoutineCompletionsUseCase = () => {
  const repository = new PrRoutineCompletionsRepository();
  return new GetRoutineCompletionsUseCase(repository);
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ nickname: string }> }) {
  try {
    const { nickname } = await params;

    if (!nickname || nickname.trim() === '') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_NICKNAME',
          message: '닉네임이 제공되지 않았습니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const getRoutineCompletionsUseCase = createGetRoutineCompletionsUseCase();

    // 해당 닉네임의 모든 루틴 완료 조회
    const completions = await getRoutineCompletionsUseCase.getByNickname(nickname.trim());

    const successResponse: ApiResponse<RoutineCompletionDto[]> = {
      success: true,
      data: completions,
      message: '루틴 완료 목록을 성공적으로 조회했습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 완료 목록 조회 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: '루틴 완료 목록 조회에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
