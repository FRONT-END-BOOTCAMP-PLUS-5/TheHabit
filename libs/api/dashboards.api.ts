import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { Dashboard } from '@/backend/dashboards/domain/entity/Dashboard';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';

// Dashboard API 응답 타입
interface DashboardListResponse {
  challenges: Challenge[];
  dashboards: Dashboard[];
  totalCount: number;
}

// 닉네임으로 대시보드 조회
export const getDashboardByNickname = async (nickname: string): Promise<Dashboard> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Dashboard>>(`/api/dashboards/${nickname}`);

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
