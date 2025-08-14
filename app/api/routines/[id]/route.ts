import { NextRequest, NextResponse } from 'next/server';
import { GetRoutineByIdUseCase } from '../../../../backend/routines/applications/usecases/GetRoutineByIdUseCase';
import { UpdateRoutineUseCase } from '../../../../backend/routines/applications/usecases/UpdateRoutineUseCase';
import { DeleteRoutineUseCase } from '../../../../backend/routines/applications/usecases/DeleteRoutineUseCase';
import { PrRoutinesRepository } from '../../../../backend/routines/infrastructures/repositories/PrRoutinesRepository';

// Repository 인스턴스 생성
const routinesRepository = new PrRoutinesRepository();

// GET /api/routines/[id] - 특정 루틴 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const routineId = parseInt(id);

    if (isNaN(routineId)) {
      return NextResponse.json({ error: '유효하지 않은 루틴 ID입니다.' }, { status: 400 });
    }

    const getRoutineByIdUseCase = new GetRoutineByIdUseCase(routinesRepository);
    const result = await getRoutineByIdUseCase.execute({ routineId });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('루틴 조회 중 오류 발생:', error);

    if (error instanceof Error && error.message.includes('찾을 수 없습니다')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: '루틴 조회에 실패했습니다.' }, { status: 500 });
  }
}

// PUT /api/routines/[id] - 루틴 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const routineId = parseInt(id);
    const body = await request.json();

    if (isNaN(routineId)) {
      return NextResponse.json({ error: '유효하지 않은 루틴 ID입니다.' }, { status: 400 });
    }

    const { routineTitle, alertTime, emoji } = body;

    const updateRoutineUseCase = new UpdateRoutineUseCase(routinesRepository);
    const result = await updateRoutineUseCase.execute({
      routineId,
      routineTitle,
      alertTime: alertTime ? new Date(alertTime) : null,
      emoji,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('루틴 수정 중 오류 발생:', error);

    if (error instanceof Error && error.message.includes('찾을 수 없습니다')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: '루틴 수정에 실패했습니다.' }, { status: 500 });
  }
}

// DELETE /api/routines/[id] - 루틴 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const routineId = parseInt(id);

    if (isNaN(routineId)) {
      return NextResponse.json({ error: '유효하지 않은 루틴 ID입니다.' }, { status: 400 });
    }

    const deleteRoutineUseCase = new DeleteRoutineUseCase(routinesRepository);
    const result = await deleteRoutineUseCase.execute({ routineId });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('루틴 삭제 중 오류 발생:', error);

    if (error instanceof Error && error.message.includes('찾을 수 없습니다')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: '루틴 삭제에 실패했습니다.' }, { status: 500 });
  }
}
