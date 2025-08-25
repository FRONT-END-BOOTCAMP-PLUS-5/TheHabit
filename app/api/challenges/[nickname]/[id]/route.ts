import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { ExtendChallengeUsecase } from '@/backend/challenges/applications/usecases/ExtendChallengeUsecase';
import { CompleteChallengeUsecase } from '@/backend/challenges/applications/usecases/CompleteChallengeUsecase';
import { PrChallengeRepository } from '@/backend/challenges/infrastructures/repositories/PrChallengeRepository';

// UseCase 생성 함수
const createExtendChallengeUsecase = () => {
  const repository = new PrChallengeRepository();
  return new ExtendChallengeUsecase(repository);
};

const createCompleteChallengeUsecase = () => {
  const repository = new PrChallengeRepository();
  return new CompleteChallengeUsecase(repository);
};

// 챌린지 연장/완료 처리 (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string; id: string }> }
): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const { nickname, id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action || !['extend', 'complete'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: '유효하지 않은 액션입니다. "extend" 또는 "complete"를 사용해주세요.'
          }
        },
        { status: 400 }
      );
    }

    const challengeId = parseInt(id);
    if (isNaN(challengeId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CHALLENGE_ID',
            message: '유효하지 않은 챌린지 ID입니다.'
          }
        },
        { status: 400 }
      );
    }

    if (action === 'extend') {
      // 챌린지 연장 처리
      const extendChallengeUsecase = createExtendChallengeUsecase();
      const result = await extendChallengeUsecase.execute({
        challengeId,
        nickname
      });

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: result.message,
          data: result.challenge
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: result.error
          },
          { status: 400 }
        );
      }
    } else if (action === 'complete') {
      // 챌린지 완료 처리
      const completeChallengeUsecase = createCompleteChallengeUsecase();
      const result = await completeChallengeUsecase.execute({
        challengeId,
        nickname
      });

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: result.message,
          data: result.challenge
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: result.error
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNKNOWN_ACTION',
          message: '알 수 없는 액션입니다.'
        }
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('챌린지 연장/완료 처리 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 내부 오류가 발생했습니다.'
        }
      },
      { status: 500 }
    );
  }
}
