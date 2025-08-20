// GET /api/challenges - 전체 챌린지 목록 조회
// POST /api/challenges - 챌린지 등록
import { NextRequest, NextResponse } from 'next/server';
import { PrChallengeRepository } from '@/backend/challenges/infrastructures/repositories/PrChallengeRepository';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { GetChallengeByIdUsecase } from '@/backend/challenges/applications/usecases/GetChallengeByIdUsecase';
import { ChallengeDtoMapper } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { AddChallengeUseCase } from '@/backend/challenges/applications/usecases/AddChallengeUsecase';
import { AddChallengeRequestDto } from '@/backend/challenges/applications/dtos/AddChallengeDto';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

const challengeRepository = new PrChallengeRepository();
const userRepository = new PrUserRepository();

const createGetChallengeByIdUsecase = () => {
  return new GetChallengeByIdUsecase(challengeRepository);
};

const createAddChallengeUsecase = () => {
  return new AddChallengeUseCase(challengeRepository, userRepository);
};

export const GET = async (
  request: NextRequest
): Promise<NextResponse<ApiResponse<ChallengeDto | null>>> => {
  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get('id');

  if (!challengeId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: '챌린지 ID가 필요합니다.',
        },
      },
      { status: 400 }
    );
  }

  const usecase = createGetChallengeByIdUsecase();
  const challenge = await usecase.execute(Number(challengeId));

  if (!challenge) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '챌린지를 찾을 수 없습니다.',
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: ChallengeDtoMapper.fromEntity(challenge),
    message: '챌린지 조회에 성공했습니다.',
  });
};

// 챌린지 생성 API Post
export const POST = async (requestBody: NextRequest): Promise<NextResponse<ApiResponse<ChallengeDto>>> => {
  const usecase = createAddChallengeUsecase();
  try {
    const requestChallenge: AddChallengeRequestDto = await requestBody.json();

    const challenge = await usecase.execute(requestChallenge);

    return NextResponse.json(
      {
        success: true,
        data: ChallengeDtoMapper.fromEntity(challenge),
        message: '챌린지가 성공적으로 생성되었습니다.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('챌린지 생성 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATION_FAILED',
          message: '챌린지 생성에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
};
