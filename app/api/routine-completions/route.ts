import { NextRequest, NextResponse } from 'next/server';
import { AddRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/AddRoutineCompletionUseCase';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { GetRoutinesUseCase } from '@/backend/routines/applications/usecases/GetRoutinesUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { PrRoutinesRepository } from '@/backend/routines/infrastructures/repositories/PrRoutinesRepository';
import { getSessionUserIdOrError } from '@/libs/utils/sessionUtils';

const routineCompletionsRepository = new PrRoutineCompletionsRepository();
const routinesRepository = new PrRoutinesRepository();

// 루틴 완료 생성 (POST)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{}> }
): Promise<NextResponse> {
  try {
    const { userId, errorResponse } = await getSessionUserIdOrError();
    if (errorResponse) return errorResponse;

    const { routineId, proofImgUrl } = await req.json();
    // 필수 파라미터 검증
    if (!routineId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다: routineId' },
        { status: 400 }
      );
    }

    const addRoutineCompletionUseCase = new AddRoutineCompletionUseCase(
      routineCompletionsRepository
    );

    const result = await addRoutineCompletionUseCase.execute({
      userId: userId!, // 세션에서 가져온 사용자 ID
      routineId: parseInt(routineId),
      proofImgUrl: proofImgUrl || null,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('루틴 완료 생성 오류:', error);
    return NextResponse.json({ error: '루틴 완료 생성에 실패했습니다.' }, { status: 500 });
  }
}

// 루틴 완료 목록 조회 (GET)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{}> }
): Promise<NextResponse> {
  try {
    // 세션에서 사용자 ID 가져오기
    const { userId, errorResponse } = await getSessionUserIdOrError();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');

    // 필수 파라미터 검증
    if (!challengeId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다: challengeId' },
        { status: 400 }
      );
    }

    const getRoutinesUseCase = new GetRoutinesUseCase(routinesRepository);
    const getRoutineCompletionsUseCase = new GetRoutineCompletionsUseCase(
      routineCompletionsRepository
    );

    // 1. 해당 챌린지의 루틴 목록 조회
    const routines = await getRoutinesUseCase.getByChallengeId(parseInt(challengeId!));

    // 2. 각 루틴에 대한 사용자의 완료 상태 조회 (병렬 처리로 성능 개선)
    const completionPromises = routines.map(routine =>
      getRoutineCompletionsUseCase.getByUserAndRoutine(userId!, routine.id)
    );
    const completionResults = await Promise.all(completionPromises);
    const completions = completionResults.flat();

    return NextResponse.json(completions);
  } catch (error) {
    console.error('루틴 완료 목록 조회 오류:', error);
    return NextResponse.json({ error: '루틴 완료 목록 조회에 실패했습니다.' }, { status: 500 });
  }
}
