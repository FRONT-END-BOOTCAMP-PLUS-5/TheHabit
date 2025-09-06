import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
import { ChallengeDto } from '@/backend/challenges/application/dtos/ChallengeDto';
import { ReadRoutineResponseDto } from '@/backend/routines/application/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/application/dtos/RoutineCompletionDto';
import { UserChallengeAndRoutineAndFollowAndCompletionDto } from '@/backend/users/application/dtos/UserChallengeAndRoutineAndFollowAndCompletion';

// Dashboard API 응답 타입  
interface DashboardListResponse {
  challenges: ChallengeDto[];
  routines: ReadRoutineResponseDto[];
  routineCompletions: RoutineCompletionDto[];
}

// 닉네임으로 유저의 챌린지, 루틴, 팔로우, 완료 정보 조회
export const getUserChallengeAndRoutineAndFollowAndCompletion = async (
  nickname: string
): Promise<ApiResponse<UserChallengeAndRoutineAndFollowAndCompletionDto>> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<UserChallengeAndRoutineAndFollowAndCompletionDto>
    >(`/api/users/${nickname}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 닉네임으로 대시보드 조회
export const getDashboardByNickname = async (nickname: string): Promise<DashboardDto> => {
  try {
    const response = await axiosInstance.get<ApiResponse<DashboardDto>>(`/api/dashboards/${nickname}`);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || '대시보드 조회에 실패했습니다.');
    }

    return response.data.data;
  } catch (error) {
    console.error('대시보드 조회 중 오류:', error);
    throw error;
  }
};

// 전체 대시보드 조회
export const getAllDashboards = async (): Promise<DashboardListResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<DashboardListResponse>>('/api/dashboards');

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || '전체 대시보드 조회에 실패했습니다.');
    }

    return response.data.data;
  } catch (error) {
    console.error('전체 대시보드 조회 중 오류:', error);
    throw error;
  }
};
