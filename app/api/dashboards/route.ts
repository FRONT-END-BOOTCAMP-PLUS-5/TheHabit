import { NextResponse } from "next/server";
import { GetAllDashboardsUsecase } from "@/backend/dashboards/application/usecases/GetAllDashboardsUsecase";
import { PrDashboardRepository } from "@/backend/dashboards/infrastructure/repository/PrDashboardRepository";
import { ApiResponse } from "@/backend/shared/types/ApiResponse";
import { DashboardDto } from "@/backend/dashboards/application/dtos/DashboardDto";

const repository = new PrDashboardRepository();
const usecase = new GetAllDashboardsUsecase(repository);

export async function GET() {
  try {
    const dashboards = await usecase.execute();

    const dtoList: DashboardDto[] = dashboards.map(dashboard => ({
      challenge: dashboard.challenge
        ? {
          id: dashboard.challenge.id,
          name: dashboard.challenge.name,
          createdAt: dashboard.challenge.createdAt.toISOString(),
          endAt: dashboard.challenge.endAt.toISOString(),
          startTime: dashboard.challenge.startTime ? dashboard.challenge.startTime.toISOString() : null,
          endTime: dashboard.challenge.endTime ? dashboard.challenge.endTime.toISOString() : null,
          color: dashboard.challenge.color,
          categoryId: dashboard.challenge.categoryId
        }
        : null,
      routines: dashboard.routines.map(routine => ({
        id: routine.id,
        routineTitle: routine.routineTitle,
        alertTime: routine.alertTime ? routine.alertTime.toISOString() : null,
        emoji: routine.emoji,
        challengeId: routine.challengeId,
        createdAt: routine.createdAt.toISOString(),
        updatedAt: routine.updatedAt.toISOString()
      })),
      routineCount: dashboard.routineCount,
      routineCompletion: dashboard.routineCompletion.map(rc => ({
        id: rc.id,
        routineId: rc.routineId,
        createdAt: rc.createdAt.toISOString(),
        proofImgUrl: rc.proofImgUrl
      }))
    }));

    const successResponse: ApiResponse<{ dashboards: DashboardDto[]; totalCount: number }> = {
      success: true,
      data: {
        dashboards: dtoList,
        totalCount: dtoList.length
      },
      message: '전체 대시보드 조회에 성공했습니다.'
    };
    return NextResponse.json(successResponse);
  } catch (error: unknown) {

    if (error instanceof Error) {
      return NextResponse.json(error.message, { status: 500 });
    }

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
