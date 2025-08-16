import { NextRequest, NextResponse } from 'next/server';
import { AddRoutineUseCase } from '@/backend/routines/applications/usecases/AddRoutineUseCase';
import { GetRoutinesUseCase } from '@/backend/routines/applications/usecases/GetRoutinesUseCase';
import { PrRoutinesRepository } from '@/backend/routines/infrastructures/repositories/PrRoutinesRepository';
import { CreateRoutineRequestDto, ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { getSessionUserIdOrError } from '@/libs/utils/sessionUtils';

const repository = new PrRoutinesRepository();

const createAddRoutineUseCase = () => {
  return new AddRoutineUseCase(repository);
};

const createGetRoutinesUseCase = () => {
  return new GetRoutinesUseCase(repository);
};

// 루틴 생성
export const POST = async (requestBody: NextRequest): Promise<NextResponse> => {
  const usecase = createAddRoutineUseCase();

  try {
    // 요청 바디를 콘솔에 출력
    console.log('=== POST /api/routines 요청 시작 ===');
    console.log('요청 URL:', requestBody.url);
    console.log('요청 메서드:', requestBody.method);
    console.log('요청 헤더:', Object.fromEntries(requestBody.headers.entries()));

    // 세션 인증 체크
    const { userId, errorResponse } = await getSessionUserIdOrError();
    if (errorResponse) return errorResponse;
    const requestRoutine: CreateRoutineRequestDto = await requestBody.json();
    
    // userId를 요청에 추가
    const routineWithUserId = {
      ...requestRoutine,
      userId: userId!
    };

    const routine = await usecase.execute(routineWithUserId);

    return NextResponse.json(
      {
        success: true,
        data: routine,
        message: '루틴이 성공적으로 생성되었습니다.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('루틴 생성 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATION_FAILED',
          message: '루틴 생성에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
};

// GET /api/routines - 루틴 목록 조회
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const usecase = createGetRoutinesUseCase();

  try {
    console.log('=== GET /api/routines 요청 시작 ===');
    console.log('요청 URL:', request.url);

    // 세션 인증 체크
    const { userId, errorResponse } = await getSessionUserIdOrError();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');

    console.log('쿼리 파라미터 - challengeId:', challengeId, 'userId:', userId);

    let routines;
    if (challengeId) {
      routines = await usecase.getByChallengeId(parseInt(challengeId));
    } else {
      routines = await usecase.getByUserId(userId!);
    }

    return NextResponse.json({
      success: true,
      data: routines,
      message: '루틴 목록을 성공적으로 조회했습니다.',
    });
  } catch (error) {
    console.error('루틴 조회 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: '루틴 조회에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
};
