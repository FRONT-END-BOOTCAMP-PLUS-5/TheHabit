import { NextResponse } from "next/server";
import { GetAllDashboardsUsecase } from "@/backend/dashboards/application/usecases/GetAllDashboardsUsecase";
import { PrDashboardRepository } from "@/backend/dashboards/infrastructure/repository/PrDashboardRepository";
import { ApiResponse } from "@/backend/shared/types/ApiResponse";
import { Dashboard } from "@/backend/dashboards/domain/entity/Dashboard";

const repository = new PrDashboardRepository();
const usecase = new GetAllDashboardsUsecase(repository);

export async function GET() {
  try {
    console.log('🔍 전체 대시보드 조회 요청');

    const dashboards = await usecase.execute();

    console.log('✅ 전체 대시보드 조회 성공:', {
      totalCount: dashboards.length,
      summary: dashboards.map(dashboard => ({
        challengeName: dashboard.challenge?.name || '챌린지 없음',
        routineCount: dashboard.routineCount
      }))
    });

    const successResponse: ApiResponse<{ dashboards: Dashboard[]; totalCount: number }> = {
      success: true,
      data: {
        dashboards,
        totalCount: dashboards.length
      },
      message: '전체 대시보드 조회에 성공했습니다.'
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('❌ 전체 대시보드 조회 중 오류:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '전체 대시보드 조회에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
