import { NextRequest, NextResponse } from "next/server";
import { CompleteRoutineUseCase } from "../../../../../backend/routine-completions/applications/usecases/CompleteRoutineUseCase";
import { GetRoutineCompletionsUseCase } from "../../../../../backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase";
import { PrRoutineCompletionsRepository } from "../../../../../backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository";

// Repository 인스턴스 생성
const routineCompletionsRepository = new PrRoutineCompletionsRepository();

// POST /api/routines/[id]/complete - 루틴 완료 처리
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const routineId = parseInt(id);
    const body = await request.json();

    if (isNaN(routineId)) {
      return NextResponse.json(
        { error: "유효하지 않은 루틴 ID입니다." },
        { status: 400 }
      );
    }

    const { userId, proofImgUrl } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const completeRoutineUseCase = new CompleteRoutineUseCase(
      routineCompletionsRepository
    );
    const result = await completeRoutineUseCase.execute({
      userId,
      routineId,
      proofImgUrl: proofImgUrl || null,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("루틴 완료 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "루틴 완료 처리에 실패했습니다." },
      { status: 500 }
    );
  }
}

// GET /api/routines/[id]/complete - 루틴 완료 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const routineId = parseInt(id);

    if (isNaN(routineId)) {
      return NextResponse.json(
        { error: "유효하지 않은 루틴 ID입니다." },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const getRoutineCompletionsUseCase = new GetRoutineCompletionsUseCase(
      routineCompletionsRepository
    );

    let result;
    if (userId) {
      result = await getRoutineCompletionsUseCase.getByUserAndRoutine(
        userId,
        routineId
      );
    } else {
      result = await getRoutineCompletionsUseCase.getByRoutineId(routineId);
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("루틴 완료 목록 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "루틴 완료 목록 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
