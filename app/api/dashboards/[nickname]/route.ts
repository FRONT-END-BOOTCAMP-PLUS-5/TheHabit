import { NextResponse, NextRequest } from 'next/server';
import { GetDashboardByNicknameUsecase } from '@/backend/dashboards/application/usecases/GetDashboardByNicknameUsecase';
import { PrDashboardRepository } from '@/backend/dashboards/infrastructure/repository/PrDashboardRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';


const repository = new PrDashboardRepository();
const usecase = new GetDashboardByNicknameUsecase(repository);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await params;

    if (!nickname || nickname.trim() === '') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_NICKNAME',
          message: '닉네임이 제공되지 않았습니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const dashboard = await usecase.execute(nickname.trim());

    if (!dashboard) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'DASHBOARD_NOT_FOUND',
          message: '해당 닉네임의 대시보드를 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // 엔터티 -> DTO 변환 (userId 제외, 날짜는 문자열)
    const dto: DashboardDto = {
      challenge: dashboard.challenge.map((challenge) => ({
        id: challenge.id,
        name: challenge.name,
        createdAt: challenge.createdAt.toISOString(),
        endAt: challenge.endAt.toISOString(),
        color: challenge.color,
        active: challenge.active,
        categoryId: challenge.categoryId,
      })),
      routines: dashboard.routines.map(routine => ({
        id: routine.id,
        routineTitle: routine.routineTitle,
        alertTime: routine.alertTime ? routine.alertTime.toISOString() : null,
        emoji: routine.emoji,
        challengeId: routine.challengeId,
        createdAt: routine.createdAt.toISOString(),
        updatedAt: routine.updatedAt.toISOString(),
      })),
      routineCompletions: dashboard.routineCompletion.map((routineCompletion) => ({
        id: routineCompletion.id,
        routineId: routineCompletion.routineId,
        createdAt: routineCompletion.createdAt.toISOString(),
        proofImgUrl: routineCompletion.proofImgUrl,
        content: routineCompletion.content,
      })),
    };

    const successResponse: ApiResponse<DashboardDto> = {
      success: true,
      data: dto,
      message: '대시보드 조회에 성공했습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '대시보드 조회에 실패했습니다.',
      },
    };

    if (error instanceof Error) {
      return NextResponse.json(errorResponse, { status: 500 });
    }

  }
}
