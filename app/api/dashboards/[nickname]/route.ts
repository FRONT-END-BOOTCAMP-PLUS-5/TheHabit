import { NextResponse, NextRequest } from "next/server";
import { GetDashboardByNicknameUsecase } from "@/backend/dashboards/application/usecases/GetDashboardByNicknameUsecase";
import { PrDashboardRepository } from "@/backend/dashboards/infrastructure/repository/PrDashboardRepository";
import { ApiResponse } from "@/backend/shared/types/ApiResponse";
import { Dashboard } from "@/backend/dashboards/domain/entity/Dashboard";

const repository = new PrDashboardRepository();
const usecase = new GetDashboardByNicknameUsecase(repository);

export async function GET(request: NextRequest, { params }: { params: Promise<{ nickname: string }> }) {
  try {
    const { nickname } = await params;

    console.log('🔍 대시보드 조회 요청:', nickname);

    if (!nickname || nickname.trim() === '') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_NICKNAME',
          message: '닉네임이 제공되지 않았습니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const dashboard = await usecase.execute(nickname.trim());

    if (!dashboard) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'DASHBOARD_NOT_FOUND',
          message: '해당 닉네임의 대시보드를 찾을 수 없습니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    console.log('✅ 대시보드 조회 성공:', {
      nickname,
      challengeName: dashboard.challenge?.name || '챌린지 없음',
      routineCount: dashboard.routineCount
    });

    const successResponse: ApiResponse<Dashboard> = {
      success: true,
      data: dashboard,
      message: '대시보드 조회에 성공했습니다.'
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('❌ 대시보드 조회 중 오류:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '대시보드 조회에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
