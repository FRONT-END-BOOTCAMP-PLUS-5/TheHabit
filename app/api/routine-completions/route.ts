import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { AddRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/AddRoutineCompletionUseCase';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { GetRoutinesUseCase } from '@/backend/routines/applications/usecases/GetRoutinesUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { PrRoutinesRepository } from '@/backend/routines/infrastructures/repositories/PrRoutinesRepository';

const routineCompletionsRepository = new PrRoutineCompletionsRepository();
const routinesRepository = new PrRoutinesRepository();

// 루틴 완료 생성 (POST)
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

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
      userId: session.user.id, // 세션에서 실제 사용자 ID 사용
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
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

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
      getRoutineCompletionsUseCase.getByUserAndRoutine(session.user.id, routine.id)
    );

    const completionResults = await Promise.all(completionPromises);
    const completions = completionResults.flat();

    return NextResponse.json(completions);
  } catch (error) {
    console.error('루틴 완료 목록 조회 오류:', error);
    return NextResponse.json({ error: '루틴 완료 목록 조회에 실패했습니다.' }, { status: 500 });
  }
}
