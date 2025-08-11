// GET /api/challenges/categories/[categoryId] - 카테고리별 챌린지 목록 조회
import { NextRequest, NextResponse } from "next/server";
import { PrChallengeRepository } from "@/backend/challenges/infrastructures/repositories/PrChallengeRepository";
import { GetChallengesByCategoryUsecase } from "@/backend/challenges/applications/usecases/GetChallengesByCategoryUsecase";
import { ChallengeDtoMapper } from "@/backend/challenges/applications/dtos/ChallengeDto";
import { ChallengeDto } from "@/backend/challenges/applications/dtos/ChallengeDto";

const createGetChallengesByCategoryUsecase = () => {
  const repository = new PrChallengeRepository()
  return new GetChallengesByCategoryUsecase(repository);
}

// 응답 타입 정의
interface CategoryChallengesResponse {
  success: boolean;
  data?: ChallengeDto[];
  message?: string;
  count?: number;
  error?: {
    code: string;
    message: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
): Promise<NextResponse<CategoryChallengesResponse>> {
  try {
    // categoryId를 숫자로 변환
    const { categoryId: categoryIdStr } = await params;
    const categoryId = parseInt(categoryIdStr, 10);

    // 유효성 검사
    if (isNaN(categoryId) || categoryId <= 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: "INVALID_CATEGORY_ID",
          message: "유효하지 않은 카테고리 ID입니다."
        }
      }, { status: 400 });
    }

    console.log("=== GET /api/challenges/categories/[categoryId] 요청 시작 ===");
    console.log("카테고리 ID:", categoryId);
    console.log("요청 URL:", request.url);
    console.log("=== GET /api/challenges/categories/[categoryId] 요청 끝 ===");

    const usecase = createGetChallengesByCategoryUsecase();
    const challenges = await usecase.execute(categoryId);

    console.log(`카테고리 ${categoryId}의 챌린지 개수:`, challenges.length);

    return NextResponse.json({
      success: true,
      data: ChallengeDtoMapper.fromEntities(challenges),
      message: `카테고리 ${categoryId}의 챌린지를 성공적으로 조회했습니다.`,
      count: challenges.length
    });

  } catch (error) {
    console.error("카테고리별 챌린지 조회 중 오류 발생:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: "카테고리별 챌린지 조회에 실패했습니다."
      }
    }, { status: 500 });
  }
} 