import { NextResponse, NextRequest } from "next/server";
import { GetChallengesByNicknameUsecase } from "@/backend/challenges/applications/usecases/GetChallengesByNicknameUsecase";
import { PrChallengeRepository } from "@/backend/challenges/infrastructures/repositories/PrChallengeRepository";

const repository = new PrChallengeRepository();
const usecase = new GetChallengesByNicknameUsecase(repository);

export async function GET(request: NextRequest, { params }: { params: Promise<{ nickname: string }> }) {
  const { nickname } = await params;
  const challenges = await usecase.execute(nickname);

  console.log('🔍 챌린지 조회 결과:', challenges);
  return NextResponse.json(challenges);
}