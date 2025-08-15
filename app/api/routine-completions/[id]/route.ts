// GET /api/routine-completions/[id] - 특정 루틴 완료 조회
// PATCH /api/routine-completions/[id] - 루틴 완료 수정
// DELETE /api/routine-completions/[id] - 루틴 완료 삭제
import { NextRequest, NextResponse } from 'next/server';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { UpdateRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/UpdateRoutineCompletionUseCase';
import { DeleteRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/DeleteRoutineCompletionUseCase';
import { RoutineCompletionDtoMapper } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

const createUpdateRoutineCompletionUseCase = () => {
  const repository = new PrRoutineCompletionsRepository();
  return new UpdateRoutineCompletionUseCase(repository);
};

const createDeleteRoutineCompletionUseCase = () => {
  const repository = new PrRoutineCompletionsRepository();
  return new DeleteRoutineCompletionUseCase(repository);
};

// 응답 타입 정의
type RoutineCompletionResponse = ApiResponse<RoutineCompletionDto>;

// 특정 루틴 완료 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RoutineCompletionResponse>> {
  try {
    const { id } = await params;
    const completionId = parseInt(id, 10);

    // 유효성 검사
    if (isNaN(completionId) || completionId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_COMPLETION_ID',
            message: '유효하지 않은 완료 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    console.log('=== GET /api/routine-completions/[id] 요청 시작 ===');
    console.log('완료 ID:', completionId);
    console.log('요청 URL:', request.url);
    console.log('=== GET /api/routine-completions/[id] 요청 끝 ===');

    // Repository 직접 사용 (단일 완료 조회를 위한 메서드)
    const repository = new PrRoutineCompletionsRepository();
    const completion = await repository.findById(completionId);

    if (!completion) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'COMPLETION_NOT_FOUND',
            message: '루틴 완료를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: RoutineCompletionDtoMapper.fromEntity(completion),
      message: '루틴 완료를 성공적으로 조회했습니다.',
    });
  } catch (error) {
    console.error('루틴 완료 조회 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error instanceof Error ? error.message : '루틴 완료 조회에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

// 루틴 완료 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RoutineCompletionResponse>> {
  try {
    const { id } = await params;
    const completionId = parseInt(id, 10);

    // 유효성 검사
    if (isNaN(completionId) || completionId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_COMPLETION_ID',
            message: '유효하지 않은 완료 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    console.log('=== PATCH /api/routine-completions/[id] 요청 시작 ===');
    console.log('완료 ID:', completionId);
    console.log('요청 URL:', request.url);

    const requestData: { proofImgUrl: string | null } = await request.json();
    console.log('요청 바디:', JSON.stringify(requestData, null, 2));
    console.log('=== PATCH /api/routine-completions/[id] 요청 끝 ===');

    const usecase = createUpdateRoutineCompletionUseCase();
    const updatedCompletion = await usecase.execute(completionId, {
      proofImgUrl: requestData.proofImgUrl,
    });

    return NextResponse.json({
      success: true,
      data: RoutineCompletionDtoMapper.fromEntity(updatedCompletion),
      message: '루틴 완료가 성공적으로 수정되었습니다.',
    });
  } catch (error) {
    console.error('루틴 완료 수정 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: error instanceof Error ? error.message : '루틴 완료 수정에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

// 루틴 완료 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RoutineCompletionResponse>> {
  try {
    const { id } = await params;
    const completionId = parseInt(id, 10);

    // 유효성 검사
    if (isNaN(completionId) || completionId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_COMPLETION_ID',
            message: '유효하지 않은 완료 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    console.log('=== DELETE /api/routine-completions/[id] 요청 시작 ===');
    console.log('완료 ID:', completionId);
    console.log('요청 URL:', request.url);
    console.log('=== DELETE /api/routine-completions/[id] 요청 끝 ===');

    // 기존 루틴 완료 조회 (삭제 전 확인)
    const repository = new PrRoutineCompletionsRepository();
    const existingCompletion = await repository.findById(completionId);

    if (!existingCompletion) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'COMPLETION_NOT_FOUND',
            message: '루틴 완료를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      );
    }

    const usecase = createDeleteRoutineCompletionUseCase();
    await usecase.execute(existingCompletion);

    return NextResponse.json({
      success: true,
      message: '루틴 완료가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('루틴 완료 삭제 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: error instanceof Error ? error.message : '루틴 완료 삭제에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
