import { NextRequest, NextResponse } from 'next/server';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { DeleteRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/DeleteRoutineCompletionUseCase';
import {
  RoutineCompletionDtoMapper,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

const createDeleteRoutineCompletionUseCase = () => {
  const repository = new PrRoutineCompletionsRepository();
  return new DeleteRoutineCompletionUseCase(repository);
};

// 루틴 완료 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const completionId = Number(id);

    if (isNaN(completionId) || completionId <= 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_COMPLETION_ID',
          message: '유효하지 않은 완료 ID입니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const repository = new PrRoutineCompletionsRepository();
    const completion = await repository.findById(completionId);

    if (!completion) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'COMPLETION_NOT_FOUND',
          message: '루틴 완료를 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const successResponse: ApiResponse<RoutineCompletionDto> = {
      success: true,
      data: RoutineCompletionDtoMapper.fromEntity(completion),
      message: '루틴 완료를 성공적으로 조회했습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 완료 조회 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error instanceof Error ? error.message : '루틴 완료 조회에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 루틴 완료 수정
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const completionId = Number(id);

    if (isNaN(completionId) || completionId <= 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_COMPLETION_ID',
          message: '유효하지 않은 완료 ID입니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const requestData = await request.json();
    const { proofImgUrl } = requestData;

    if (proofImgUrl !== null && typeof proofImgUrl !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_PROOF_IMG_URL',
          message: '유효하지 않은 인증 이미지 URL입니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const usecase = createUpdateRoutineCompletionUseCase();
    const updatedCompletion = await usecase.execute(completionId, { proofImgUrl });

    const successResponse: ApiResponse<RoutineCompletionDto> = {
      success: true,
      data: RoutineCompletionDtoMapper.fromEntity(updatedCompletion),
      message: '루틴 완료가 성공적으로 수정되었습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 완료 수정 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: error instanceof Error ? error.message : '루틴 완료 수정에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 루틴 완료 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const completionId = Number(id);

    if (isNaN(completionId) || completionId <= 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_COMPLETION_ID',
          message: '유효하지 않은 완료 ID입니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 기존 루틴 완료 조회
    const repository = new PrRoutineCompletionsRepository();
    const existingCompletion = await repository.findById(completionId);

    if (!existingCompletion) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'COMPLETION_NOT_FOUND',
          message: '루틴 완료를 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const usecase = createDeleteRoutineCompletionUseCase();
    await usecase.execute(existingCompletion);

    const successResponse: ApiResponse<null> = {
      success: true,
      data: null,
      message: '루틴 완료가 성공적으로 삭제되었습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 완료 삭제 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: error instanceof Error ? error.message : '루틴 완료 삭제에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
