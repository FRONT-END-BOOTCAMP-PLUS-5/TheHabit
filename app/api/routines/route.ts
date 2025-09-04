import { NextRequest, NextResponse } from 'next/server';
import { AddRoutineUseCase } from '@/backend/routines/applications/usecases/AddRoutineUseCase';
import { GetRoutinesUseCase } from '@/backend/routines/applications/usecases/GetRoutinesUseCase';
import { DeleteRoutineUseCase } from '@/backend/routines/applications/usecases/DeleteRoutineUseCase';
import { UpdateRoutineUseCase } from '@/backend/routines/applications/usecases/UpdateRoutineUseCase';
import { PrRoutinesRepository } from '@/backend/routines/infrastructure/repositories/PrRoutinesRepository';
import { IRoutinesRepository } from '@/backend/routines/domains/repositories/IRoutinesRepository';
import {
  CreateRoutineRequestDto,
  ReadRoutineResponseDto,
  UpdateRoutineRequestDto,
} from '@/backend/routines/applications/dtos/RoutineDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

// 의존성 해결 함수들
const createRoutinesRepository = (): IRoutinesRepository => {
  return new PrRoutinesRepository();
};

const createAddRoutineUseCase = (): AddRoutineUseCase => {
  return new AddRoutineUseCase(createRoutinesRepository());
};

const createGetRoutinesUseCase = (): GetRoutinesUseCase => {
  return new GetRoutinesUseCase(createRoutinesRepository());
};

const createDeleteRoutineUseCase = (): DeleteRoutineUseCase => {
  return new DeleteRoutineUseCase(createRoutinesRepository());
};

const createUpdateRoutineUseCase = (): UpdateRoutineUseCase => {
  return new UpdateRoutineUseCase(createRoutinesRepository());
};

// 루틴 생성
export const POST = async (requestBody: NextRequest): Promise<NextResponse> => {
  const usecase = createAddRoutineUseCase();

  try {
    const requestRoutine: CreateRoutineRequestDto & { nickname: string } = await requestBody.json();
    console.log('🚀 API에서 받은 데이터:', requestRoutine);

    const { nickname } = requestRoutine;
    if (!nickname || nickname.trim() === '') {
      console.log('❌ 닉네임 검증 실패');
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_NICKNAME',
          message: '닉네임이 제공되지 않았습니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    console.log('✅ 닉네임 검증 성공, UseCase 실행 중...');
    const routine = await usecase.executeByNickname({
      ...requestRoutine,
      nickname: nickname.trim(),
    });

    console.log('✅ 루틴 생성 성공:', routine);
    const successResponse: ApiResponse<ReadRoutineResponseDto> = {
      success: true,
      data: routine,
      message: '루틴이 성공적으로 생성되었습니다.',
    };
    return NextResponse.json(successResponse, { status: 201 });
  } catch (error) {
    console.error('💥 루틴 생성 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'CREATION_FAILED',
        message: '루틴 생성에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

// 루틴 목록 조회
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const usecase = createGetRoutinesUseCase();

  try {
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get('nickname');
    const challengeId = searchParams.get('challengeId');

    if (!nickname || nickname.trim() === '') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_NICKNAME',
          message: '닉네임이 제공되지 않았습니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    let routines;
    if (challengeId) {
      routines = await usecase.getByChallengeId(parseInt(challengeId));
    } else {
      routines = await usecase.getByNickname(nickname.trim());
    }

    const successResponse: ApiResponse<ReadRoutineResponseDto[]> = {
      success: true,
      data: routines,
      message: '루틴 목록을 성공적으로 조회했습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 조회 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: '루틴 조회에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

// 루틴 삭제
export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
  const usecase = createDeleteRoutineUseCase();

  try {
    const { searchParams } = new URL(request.url);
    const routineId = searchParams.get('routineId');
    const nickname = searchParams.get('nickname');

    if (!routineId || !nickname) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: 'routineId와 nickname이 모두 필요합니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const result = await usecase.execute({
      routineId: parseInt(routineId),
    });

    if (!result.success) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: result.message,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const successResponse: ApiResponse<null> = {
      success: true,
      message: result.message,
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 삭제 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: '루틴 삭제에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

// 루틴 수정
export const PUT = async (request: NextRequest): Promise<NextResponse> => {
  const usecase = createUpdateRoutineUseCase();

  try {
    const updateData: UpdateRoutineRequestDto = await request.json();

    if (!updateData.routineId) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: 'routineId가 필요합니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const result = await usecase.execute(updateData);

    const successResponse: ApiResponse<ReadRoutineResponseDto> = {
      success: true,
      data: result,
      message: '루틴이 성공적으로 수정되었습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 수정 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: '루틴 수정에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};
