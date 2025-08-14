// GET /api/challenges/[id] - 특정 챌린지 상세 조회
// PUT /api/challenges/[id] - 챌린지 수정
// DELETE /api/challenges/[id] - 챌린지 삭제
import { NextRequest, NextResponse } from 'next/server';
import { PrChallengeRepository } from '@/backend/challenges/infrastructures/repositories/PrChallengeRepository';
import { GetChallengeByIdUsecase } from '@/backend/challenges/applications/usecases/GetChallengeByIdUsecase';
import { UpdateChallengeUsecase } from '@/backend/challenges/applications/usecases/UpdateChallengeUsecase';
import { DeleteChallengeUsecase } from '@/backend/challenges/applications/usecases/DeleteChallengeUsecase';
import { ChallengeDtoMapper } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { AddChallengeRequestDto } from '@/backend/challenges/applications/dtos/AddChallengeDto';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

const createGetChallengeByIdUsecase = () => {
  const repository = new PrChallengeRepository();
  return new GetChallengeByIdUsecase(repository);
};

const createUpdateChallengeUsecase = () => {
  const repository = new PrChallengeRepository();
  return new UpdateChallengeUsecase(repository);
};

const createDeleteChallengeUsecase = () => {
  const repository = new PrChallengeRepository();
  return new DeleteChallengeUsecase(repository);
};

// 응답 타입 정의
interface ChallengeResponse {
  success: boolean;
  data?: ChallengeDto;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

// 특정 챌린지 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ChallengeResponse>> {
  try {
    const { id } = await params;
    const challengeId = parseInt(id, 10);

    // 유효성 검사
    if (isNaN(challengeId) || challengeId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CHALLENGE_ID',
            message: '유효하지 않은 챌린지 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    console.log('=== GET /api/challenges/[id] 요청 시작 ===');
    console.log('챌린지 ID:', challengeId);
    console.log('요청 URL:', request.url);
    console.log('=== GET /api/challenges/[id] 요청 끝 ===');

    const usecase = createGetChallengeByIdUsecase();
    const challenge = await usecase.execute(challengeId);

    return NextResponse.json({
      success: true,
      data: ChallengeDtoMapper.fromEntity(challenge),
      message: '챌린지를 성공적으로 조회했습니다.',
    });
  } catch (error) {
    console.error('챌린지 조회 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error instanceof Error ? error.message : '챌린지 조회에 실패했습니다.',
        },
      },
      { status: 404 }
    );
  }
}

// 챌린지 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ChallengeResponse>> {
  try {
    const { id } = await params;
    const challengeId = parseInt(id, 10);

    // 유효성 검사
    if (isNaN(challengeId) || challengeId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CHALLENGE_ID',
            message: '유효하지 않은 챌린지 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    console.log('=== PUT /api/challenges/[id] 요청 시작 ===');
    console.log('챌린지 ID:', challengeId);
    console.log('요청 URL:', request.url);

    const requestData: AddChallengeRequestDto = await request.json();
    console.log('요청 바디:', JSON.stringify(requestData, null, 2));
    console.log('=== PUT /api/challenges/[id] 요청 끝 ===');

    // 기존 챌린지 조회
    const getUsecase = createGetChallengeByIdUsecase();
    const existingChallenge = await getUsecase.execute(challengeId);

    // 업데이트할 데이터 생성
    const updatedChallenge = new Challenge(
      challengeId,
      requestData.name || existingChallenge.name,
      requestData.createdAt ? new Date(requestData.createdAt) : existingChallenge.createdAt,
      requestData.endAt ? new Date(requestData.endAt) : existingChallenge.endAt,
      requestData.startTime ? new Date(requestData.startTime) : existingChallenge.startTime,
      requestData.endTime ? new Date(requestData.endTime) : existingChallenge.endTime,
      requestData.color || existingChallenge.color,
      existingChallenge.userId, // userId는 변경 불가
      requestData.categoryId || existingChallenge.categoryId
    );

    const updateUsecase = createUpdateChallengeUsecase();
    const challenge = await updateUsecase.execute(updatedChallenge);

    return NextResponse.json({
      success: true,
      data: ChallengeDtoMapper.fromEntity(challenge),
      message: '챌린지가 성공적으로 수정되었습니다.',
    });
  } catch (error) {
    console.error('챌린지 수정 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: error instanceof Error ? error.message : '챌린지 수정에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

// 챌린지 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ChallengeResponse>> {
  try {
    const { id } = await params;
    const challengeId = parseInt(id, 10);

    // 유효성 검사
    if (isNaN(challengeId) || challengeId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CHALLENGE_ID',
            message: '유효하지 않은 챌린지 ID입니다.',
          },
        },
        { status: 400 }
      );
    }

    console.log('=== DELETE /api/challenges/[id] 요청 시작 ===');
    console.log('챌린지 ID:', challengeId);
    console.log('요청 URL:', request.url);
    console.log('=== DELETE /api/challenges/[id] 요청 끝 ===');

    // 기존 챌린지 조회 (삭제 전 확인)
    const getUsecase = createGetChallengeByIdUsecase();
    const existingChallenge = await getUsecase.execute(challengeId);

    const deleteUsecase = createDeleteChallengeUsecase();
    await deleteUsecase.execute(existingChallenge);

    return NextResponse.json({
      success: true,
      message: '챌린지가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('챌린지 삭제 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: error instanceof Error ? error.message : '챌린지 삭제에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
