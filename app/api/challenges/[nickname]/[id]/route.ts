import { NextRequest, NextResponse } from 'next/server';

import { ExtendChallengeUsecase } from '@/backend/challenges/applications/usecases/ExtendChallengeUsecase';
import { CompleteChallengeUsecase } from '@/backend/challenges/applications/usecases/CompleteChallengeUsecase';
import { PrChallengeRepository } from '@/backend/challenges/infrastructures/repositories/PrChallengeRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

const repository = new PrChallengeRepository();
const extendUsecase = new ExtendChallengeUsecase(repository);
const completeUsecase = new CompleteChallengeUsecase(repository);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const challengeId = parseInt(id);

    if (isNaN(challengeId)) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_CHALLENGE_ID',
          message: '유효하지 않은 챌린지 ID입니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 쿼리 파라미터로 액션 구분
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_ACTION',
          message: 'action 파라미터가 필요합니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    let result;
    let message: string;

    switch (action) {
      case 'extend':
        result = await extendUsecase.execute(challengeId);
        message = '챌린지가 66일로 연장되었습니다.';
        break;

      case 'complete':
        result = await completeUsecase.execute(challengeId);
        message = '챌린지가 완료되었습니다.';
        break;

      default:
        const errorResponse: ApiResponse<null> = {
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: '유효하지 않은 action입니다. (extend 또는 complete)',
          },
        };
        return NextResponse.json(errorResponse, { status: 400 });
    }

    const successResponse: ApiResponse<null> = {
      success: true,
      data: result,
      message,
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '챌린지 처리에 실패했습니다.',
      },
    };

    if (error instanceof Error) {
      errorResponse.error!.message = error.message;
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
