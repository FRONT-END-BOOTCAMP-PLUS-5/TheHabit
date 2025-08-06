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


export async function GET(request: NextRequest): Promise<NextResponse<ChallengeDto[] | null>> {
  const usecase = createGetAllChallengesUsecase();
  const challenges = await usecase.execute();

  return NextResponse.json(ChallengeDtoMapper.fromEntities(challenges));
}

export async function POST(request: Request) {
  // TODO: 챌린지 등록 구현
}
