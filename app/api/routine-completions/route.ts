import { NextRequest, NextResponse } from 'next/server';
import { AddRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/AddRoutineCompletionUseCase';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { GetRoutinesUseCase } from '@/backend/routines/applications/usecases/GetRoutinesUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { PrRoutinesRepository } from '@/backend/routines/infrastructures/repositories/PrRoutinesRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

const routineCompletionsRepository = new PrRoutineCompletionsRepository();
const routinesRepository = new PrRoutinesRepository();

// 루틴 완료 생성
export async function POST(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const { nickname, routineId, proofImgUrl } = await req.json();

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
    
    // 필수 파라미터 검증
    if (!routineId) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: '필수 파라미터가 누락되었습니다: routineId'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const addRoutineCompletionUseCase = new AddRoutineCompletionUseCase(
      routineCompletionsRepository
    );

    const result = await addRoutineCompletionUseCase.executeByNickname({
      nickname: nickname.trim(),
      routineId: parseInt(routineId),
      proofImgUrl: proofImgUrl || null,
    });

    const successResponse: ApiResponse<RoutineCompletionDto> = {
      success: true,
      data: result,
      message: '루틴이 성공적으로 완료되었습니다.'
    };
    return NextResponse.json(successResponse, { status: 201 });
  } catch (error) {
    console.error('루틴 완료 생성 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'COMPLETION_FAILED',
        message: '루틴 완료 생성에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 루틴 완료 목록 조회
export async function GET(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const nickname = searchParams.get('nickname');
    const challengeId = searchParams.get('challengeId');

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

    // 필수 파라미터 검증
    if (!challengeId) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: '필수 파라미터가 누락되었습니다: challengeId'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const getRoutinesUseCase = new GetRoutinesUseCase(routinesRepository);
    const getRoutineCompletionsUseCase = new GetRoutineCompletionsUseCase(
      routineCompletionsRepository
    );

    // 1. 해당 챌린지의 루틴 목록 조회
    const routines = await getRoutinesUseCase.getByChallengeId(parseInt(challengeId));

    // 2. 각 루틴에 대한 사용자의 완료 상태 조회 (병렬 처리로 성능 개선)
    const completionPromises = routines.map(routine =>
      getRoutineCompletionsUseCase.getByNicknameAndRoutine(nickname.trim(), routine.id)
    );
    const completionResults = await Promise.all(completionPromises);
    const completions = completionResults.flat();

    const successResponse: ApiResponse<RoutineCompletionDto[]> = {
      success: true,
      data: completions,
      message: '루틴 완료 목록을 성공적으로 조회했습니다.'
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 완료 목록 조회 오류:', error);
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