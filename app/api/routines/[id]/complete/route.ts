import { NextRequest, NextResponse } from 'next/server';
import { AddRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/AddRoutineCompletionUseCase';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

// Repository 인스턴스 생성
const routineCompletionsRepository = new PrRoutineCompletionsRepository();

// 루틴 완료 처리
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const routineId = parseInt(id);
    const { nickname, proofImgUrl } = await request.json();

    if (!nickname || nickname.trim() === '') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_NICKNAME',
          message: '닉네임이 제공되지 않았습니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (isNaN(routineId)) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_ROUTINE_ID',
          message: '유효하지 않은 루틴 ID입니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const addRoutineCompletionUseCase = new AddRoutineCompletionUseCase(routineCompletionsRepository);
    const result = await addRoutineCompletionUseCase.executeByNickname({
      nickname: nickname.trim(),
      routineId,
      review: '', // 기본값으로 빈 문자열 설정
      proofImgUrl: proofImgUrl || null,
    });

    const successResponse: ApiResponse<RoutineCompletionDto> = {
      success: true,
      data: result,
      message: '루틴이 성공적으로 완료되었습니다.'
    };
    return NextResponse.json(successResponse);
  } catch (error: unknown) {
    console.error('루틴 완료 처리 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'COMPLETION_FAILED',
        message: '루틴 완료 처리에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 루틴 완료 목록 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get('nickname');

    if (!nickname || nickname.trim() === '') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_NICKNAME',
          message: '닉네임이 제공되지 않았습니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { id } = await params;
    const routineId = parseInt(id);

    if (isNaN(routineId)) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_ROUTINE_ID',
          message: '유효하지 않은 루틴 ID입니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const getRoutineCompletionsUseCase = new GetRoutineCompletionsUseCase(
      routineCompletionsRepository
    );

    const result = await getRoutineCompletionsUseCase.getByNicknameAndRoutine(nickname.trim(), routineId);

    const successResponse: ApiResponse<RoutineCompletionDto[]> = {
      success: true,
      data: result,
      message: '루틴 완료 목록을 성공적으로 조회했습니다.'
    };
    return NextResponse.json(successResponse);
  } catch (error: unknown) {
    console.error('루틴 완료 목록 조회 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: '루틴 완료 목록 조회에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}