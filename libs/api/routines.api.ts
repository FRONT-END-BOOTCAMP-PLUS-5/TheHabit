import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import {
  CreateRoutineRequestDto,
  ReadRoutineResponseDto,
  UpdateRoutineRequestDto,
  DashboardRoutineDto,
} from '@/backend/routines/applications/dtos/RoutineDto';

// 1. Get all routines
export const getAllRoutines = async (): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response =
      await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>('/api/routines');
    return response.data;
  } catch (error) {
    console.error('전체 루틴 조회 실패:', error);
    throw error;
  }
};

// Get routines by challenge ID
export const getRoutinesByChallenge = async (
  challengeId: number
): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>(
      `/api/routines?challengeId=${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error('챌린지별 루틴 조회 실패:', error);
    throw error;
  }
};

// 3. Get routines by user
export const getRoutinesByUser = async (
  userId: string
): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>(
      `/api/routines?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('사용자별 루틴 조회 실패:', error);
    throw error;
  }
};

// 4. Get routine by ID
export const getRoutineById = async (id: number): Promise<ApiResponse<ReadRoutineResponseDto>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ReadRoutineResponseDto>>(
      `/api/routines/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('루틴 상세 조회 실패:', error);
    throw error;
  }
};

// 5. Create routine
export const createRoutine = async (
  routineData: CreateRoutineRequestDto
): Promise<ApiResponse<ReadRoutineResponseDto>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<ReadRoutineResponseDto>>(
      '/api/routines',
      routineData
    );
    return response.data;
  } catch (error) {
    console.error('루틴 생성 실패:', error);
    throw error;
  }
};

// 6. Update routine
export const updateRoutine = async (
  id: number,
  routineData: UpdateRoutineRequestDto
): Promise<ApiResponse<ReadRoutineResponseDto>> => {
  try {
    const response = await axiosInstance.put<ApiResponse<ReadRoutineResponseDto>>(
      `/api/routines/${id}`,
      routineData
    );
    return response.data;
  } catch (error) {
    console.error('루틴 수정 실패:', error);
    throw error;
  }
};

// 7. Delete routine
export const deleteRoutine = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/routines/${id}`);
    return response.data;
  } catch (error) {
    console.error('루틴 삭제 실패:', error);
    throw error;
  }
};

// 8. Get dashboard routines (with completion status)
export const getDashboardRoutines = async (
  challengeId?: number,
  userId?: string
): Promise<ApiResponse<DashboardRoutineDto[]>> => {
  try {
    let url = '/api/routines/dashboard';
    const params = new URLSearchParams();

    if (challengeId) params.append('challengeId', challengeId.toString());
    if (userId) params.append('userId', userId);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axiosInstance.get<ApiResponse<DashboardRoutineDto[]>>(url);
    return response.data;
  } catch (error) {
    console.error('대시보드 루틴 조회 실패:', error);
    throw error;
  }
};

// Convenience API object
export const routinesApi = {
  getAll: getAllRoutines,
  getByChallenge: getRoutinesByChallenge,
  getByUser: getRoutinesByUser,
  getById: getRoutineById,
  getDashboard: getDashboardRoutines,
  create: createRoutine,
  update: updateRoutine,
  delete: deleteRoutine,
};
