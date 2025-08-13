import { NextRequest, NextResponse } from 'next/server';
import { AddRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/AddRoutineCompletionUseCase';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { GetRoutinesUseCase } from '@/backend/routines/applications/usecases/GetRoutinesUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { PrRoutinesRepository } from '@/backend/routines/infrastructures/repositories/PrRoutinesRepository';
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequiredParams,
  TEMP_USER_ID,
} from '@/libs/utils/apiUtils';

const routineCompletionsRepository = new PrRoutineCompletionsRepository();
const routinesRepository = new PrRoutinesRepository();

// 루틴 완료 생성 (POST)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{}> }
): Promise<NextResponse> {
  try {
    const { routineId, proofImgUrl } = await req.json();

    // 필수 파라미터 검증
    const validation = validateRequiredParams({ routineId }, ['routineId']);
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, 400);
    }

    const addRoutineCompletionUseCase = new AddRoutineCompletionUseCase(
      routineCompletionsRepository,
    );

    const result = await addRoutineCompletionUseCase.execute({
      userId: TEMP_USER_ID, // TODO: 실제 인증 시스템에서 사용자 ID 가져오기
      routineId: parseInt(routineId),
      proofImgUrl: proofImgUrl || null,
    });

    return createSuccessResponse(result, 201);
  } catch (error) {
    console.error('루틴 완료 생성 오류:', error);
    return createErrorResponse('루틴 완료 생성에 실패했습니다.');
  }
}

// 루틴 완료 목록 조회 (GET)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{}> }
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');

    // 필수 파라미터 검증
    const validation = validateRequiredParams({ challengeId }, ['challengeId']);
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, 400);
    }

    const getRoutinesUseCase = new GetRoutinesUseCase(routinesRepository);
    const getRoutineCompletionsUseCase = new GetRoutineCompletionsUseCase(
      routineCompletionsRepository,
    );

    // 1. 해당 챌린지의 루틴 목록 조회
    const routines = await getRoutinesUseCase.getByChallengeId(
      parseInt(challengeId!),
    );

    // 2. 각 루틴에 대한 사용자의 완료 상태 조회 (병렬 처리로 성능 개선)
    const completionPromises = routines.map((routine) =>
      getRoutineCompletionsUseCase.getByUserAndRoutine(
        TEMP_USER_ID,
        routine.id,
      ),
    );

    const completionResults = await Promise.all(completionPromises);
    const completions = completionResults.flat();

    return createSuccessResponse(completions);
  } catch (error) {
    console.error('루틴 완료 목록 조회 오류:', error);
    return createErrorResponse('루틴 완료 목록 조회에 실패했습니다.');
  }
}
