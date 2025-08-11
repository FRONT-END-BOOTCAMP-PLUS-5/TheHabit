// GET /api/challenges - 전체 챌린지 목록 조회
// POST /api/challenges - 챌린지 등록
import { NextRequest, NextResponse } from "next/server";
import { PrChallengeRepository } from "@/backend/challenges/infrastructures/repositories/PrChallengeRepository";
import { GetAllChallengesUsecase } from "@/backend/challenges/applications/usecases/GetAllChallengesUsecase";
import { ChallengeDtoMapper } from "@/backend/challenges/applications/dtos/ChallengeDto";
import { AddChallengeUseCase } from "@/backend/challenges/applications/usecases/AddChallengeUsecase";
import { AddChallengeRequestDto } from "@/backend/challenges/applications/dtos/AddChallengeDto";
import { ChallengeDto } from "@/backend/challenges/applications/dtos/ChallengeDto";

const repository = new PrChallengeRepository();

const createGetAllChallengesUsecase = () => {
  return new GetAllChallengesUsecase(repository);
};

const createAddChallengeUsecase = () => {
  return new AddChallengeUseCase(repository);
};

// 실제로 서비스에서 사용되는 API는 아닙니다. -승민
export async function GET(): Promise<NextResponse<ChallengeDto[] | null>> {
  const usecase = createGetAllChallengesUsecase();
  const challenges = await usecase.execute();

  return NextResponse.json(ChallengeDtoMapper.fromEntities(challenges));
}

// 챌린지 생성 API Post
export async function POST(requestBody: NextRequest): Promise<NextResponse> {
  const usecase = createAddChallengeUsecase();
  console.log(requestBody);
  try {
    // 요청 바디를 콘솔에 출력
    console.log("=== POST /api/challenges 요청 시작 ===");
    console.log("요청 URL:", requestBody.url);
    console.log("요청 메서드:", requestBody.method);
    console.log(
      "요청 헤더:",
      Object.fromEntries(requestBody.headers.entries())
    );

    const requestChallenge: AddChallengeRequestDto = await requestBody.json();
    console.log("요청 바디 (JSON):", JSON.stringify(requestChallenge, null, 2));
    console.log("=== POST /api/challenges 요청 끝 ===");

    const challenge = await usecase.execute(requestChallenge);
    console.log("생성된 챌린지:", challenge);

    return NextResponse.json(
      {
        success: true,
        data: ChallengeDtoMapper.fromEntity(challenge),
        message: "챌린지가 성공적으로 생성되었습니다.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("챌린지 생성 중 오류 발생:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CREATION_FAILED",
          message: "챌린지 생성에 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
