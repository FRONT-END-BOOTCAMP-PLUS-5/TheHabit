import { NextRequest, NextResponse } from 'next/server';
import { AddRoutineUseCase } from '@/backend/routines/applications/usecases/AddRoutineUseCase';
import { GetRoutinesUseCase } from '@/backend/routines/applications/usecases/GetRoutinesUseCase';
import { PrRoutinesRepository } from '@/backend/routines/infrastructures/repositories/PrRoutinesRepository';
import {
  CreateRoutineRequestDto,
  ReadRoutineResponseDto,
} from '@/backend/routines/applications/dtos/RoutineDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

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
    const requestRoutine: CreateRoutineRequestDto & { nickname: string } = await requestBody.json();

    const { nickname } = requestRoutine;
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

    const routine = await usecase.executeByNickname({
      ...requestRoutine,
      nickname: nickname.trim(),
    });

    const successResponse: ApiResponse<ReadRoutineResponseDto> = {
      success: true,
      data: routine,
      message: '루틴이 성공적으로 생성되었습니다.',
    };
    return NextResponse.json(successResponse, { status: 201 });
  } catch (error) {
    console.error('루틴 생성 중 오류 발생:', error);
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
