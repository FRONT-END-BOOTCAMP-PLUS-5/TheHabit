import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import {
  CreateRoutineRequestDto,
  ReadRoutineResponseDto,
  UpdateRoutineRequestDto,
  DashboardRoutineDto,
} from '@/backend/routines/applications/dtos/RoutineDto';
import { CreateRoutineCompletionResponseDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

// 1. 닉네임으로 루틴 조회
export const getRoutinesByNickname = async (
  nickname: string
): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>(
      `/api/routines?nickname=${nickname}`
    );
    return response.data;
  } catch (error) {
    console.error('닉네임으로 루틴 조회 실패:', error);
    throw error;
  }
};

// 2. 챌린지 ID로 루틴 조회
export const getRoutinesByChallenge = async (
  challengeId: number,
  nickname: string
): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>(
      `/api/routines?challengeId=${challengeId}&nickname=${nickname}`
    );
    return response.data;
  } catch (error) {
    console.error('챌린지별 루틴 조회 실패:', error);
    throw error;
  }
};

// 3. ID로 루틴 상세 조회
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

// 4. 루틴 생성
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

// 5. 루틴 수정
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

// 6. 루틴 삭제
export const deleteRoutine = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/routines/${id}`);
    return response.data;
  } catch (error) {
    console.error('루틴 삭제 실패:', error);
    throw error;
  }
};

// 7. 대시보드 루틴 조회 (완료 상태 포함)
export const getDashboardRoutines = async (
  nickname: string,
  challengeId?: number
): Promise<ApiResponse<DashboardRoutineDto[]>> => {
  try {
    let url = '/api/routines/dashboard';
    const params = new URLSearchParams();

    params.append('nickname', nickname);
    if (challengeId) params.append('challengeId', challengeId.toString());

    url += `?${params.toString()}`;

    const response = await axiosInstance.get<ApiResponse<DashboardRoutineDto[]>>(url);
    return response.data;
  } catch (error) {
    console.error('대시보드 루틴 조회 실패:', error);
    throw error;
  }
};

// 8. 유저 루틴 완료 조회
export const getUserRoutineCompletion = async (
  nickname: string,
  pageParam: number,
  pageSize: number,
  categoryId: string
): Promise<ApiResponse<CreateRoutineCompletionResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<CreateRoutineCompletionResponseDto[]>>(
      `/api/users/routine/${nickname}`,
      {
        params: {
          nickname,
          pageParam,
          pageSize,
          categoryId,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

