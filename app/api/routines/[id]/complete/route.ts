import { NextRequest, NextResponse } from 'next/server';
import { CompleteRoutineUseCase } from '@/backend/routine-completions/applications/usecases/CompleteRoutineUseCase';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { getSessionUserIdOrError } from '@/libs/utils/sessionUtils';

// Repository 인스턴스 생성
const routineCompletionsRepository = new PrRoutineCompletionsRepository();

// 루틴 완료 처리
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 세션 인증 체크
    const { userId, errorResponse } = await getSessionUserIdOrError();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const routineId = parseInt(id);
    const body = await request.json();

    if (isNaN(routineId)) {
      return NextResponse.json({ error: '유효하지 않은 루틴 ID입니다.' }, { status: 400 });
    }

    const { proofImgUrl } = body;

    const completeRoutineUseCase = new CompleteRoutineUseCase(routineCompletionsRepository);
    const result = await completeRoutineUseCase.execute({
      userId: userId!,
      routineId,
      proofImgUrl: proofImgUrl || null,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error('루틴 완료 처리 중 오류 발생:', error);
    return NextResponse.json({ error: '루틴 완료 처리에 실패했습니다.' }, { status: 500 });
  }
}

// 루틴 완료 목록 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 세션 인증 체크
    const { userId, errorResponse } = await getSessionUserIdOrError();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const routineId = parseInt(id);

    if (isNaN(routineId)) {
      return NextResponse.json({ error: '유효하지 않은 루틴 ID입니다.' }, { status: 400 });
    }

    const getRoutineCompletionsUseCase = new GetRoutineCompletionsUseCase(
      routineCompletionsRepository
    );

    // 세션에서 가져온 userId로 개인 완료 목록 조회
    const result = await getRoutineCompletionsUseCase.getByUserAndRoutine(userId!, routineId);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('루틴 완료 목록 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '루틴 완료 목록 조회에 실패했습니다.' }, { status: 500 });
  }
}
