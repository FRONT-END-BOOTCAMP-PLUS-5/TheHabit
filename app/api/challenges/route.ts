// GET /api/challenges - 전체 챌린지 목록 조회
// POST /api/challenges - 챌린지 등록
import { NextRequest, NextResponse } from "next/server";
import { PrChallengeRepository } from "@/backend/challenges/infrastructures/repositories/PrChallengeRepository";
import { GetAllChallengesUsecase } from "@/backend/challenges/applications/usecases/GetAllChallengesUsecase";
import { ChallengeDto, ChallengeDtoMapper } from "@/backend/challenges/applications/dtos/ChallengeDto";

const createGetAllChallengesUsecase = () => {
  const repository = new PrChallengeRepository()
  return new GetAllChallengesUsecase(repository);
}


export async function GET(requestBody: NextRequest): Promise<NextResponse<ChallengeDto[] | null>> {
  const usecase = createGetAllChallengesUsecase();
  const challenges = await usecase.execute();

  return NextResponse.json(ChallengeDtoMapper.fromEntities(challenges));
}

export async function POST(requestBody: NextRequest): Promise<NextResponse> {
  try {
    // 챌린지 생성 로직
    const challenge = await createChallenge(data);

    return NextResponse.json({
      success: true,
      data: challenge,
      message: "챌린지가 성공적으로 생성되었습니다."
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: "CREATION_FAILED",
        message: "챌린지 생성에 실패했습니다."
      }
    }, { status: 500 });
  }
}
