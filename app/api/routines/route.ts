import { NextRequest, NextResponse } from 'next/server';
import { CreateRoutineUseCase } from '../../../backend/routines/applications/usecases/AddRoutineUseCase';
import { GetRoutinesUseCase } from '../../../backend/routines/applications/usecases/GetRoutinesUseCase';
import { PrRoutinesRepository } from '../../../backend/routines/infrastructures/repositories/PrRoutinesRepository';

// Repository 인스턴스 생성
const routinesRepository = new PrRoutinesRepository();

// POST /api/routines - 루틴 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 입력 데이터 유효성 검증
    const { routineTitle, alertTime, emoji, challengeId } = body;

    if (!routineTitle || !challengeId || emoji === undefined) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
    }

    // UseCase 실행
    const createRoutineUseCase = new CreateRoutineUseCase(routinesRepository);
    const result = await createRoutineUseCase.execute({
      routineTitle,
      alertTime: alertTime ? new Date(alertTime) : null,
      emoji,
      challengeId,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('루틴 생성 중 오류 발생:', error);
    return NextResponse.json({ error: '루틴 생성에 실패했습니다.' }, { status: 500 });
  }
}

// GET /api/routines - 루틴 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');
    const userId = searchParams.get('userId');

    const getRoutinesUseCase = new GetRoutinesUseCase(routinesRepository);

    let result;
    if (challengeId) {
      result = await getRoutinesUseCase.getByChallengeId(parseInt(challengeId));
    } else if (userId) {
      result = await getRoutinesUseCase.getByUserId(userId);
    } else {
      result = await getRoutinesUseCase.getAll();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('루틴 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '루틴 조회에 실패했습니다.' }, { status: 500 });
  }
}
