import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

// 루틴 완료 생성
export const createRoutineCompletion = async (
  data: FormData | CreateRoutineCompletionRequestDto
): Promise<ApiResponse<RoutineCompletionDto>> => {
  try {
    const isFormData = data instanceof FormData;
    
    const response = await axiosInstance.post<ApiResponse<RoutineCompletionDto>>(
      '/api/routine-completions',
      data,
      isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : undefined
    );

    return response.data;
  } catch (error) {
    console.error('루틴 완료 생성 실패:', error);
    throw error;
  }
};

// 챌린지별 루틴 완료 조회
export const getRoutineCompletionsByChallenge = async (
  challengeId: number,
  nickname: string
): Promise<ApiResponse<RoutineCompletionDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto[]>>(
      `/api/routine-completions?challengeId=${challengeId}&nickname=${nickname}`
    );

    return response.data;
  } catch (error) {
    console.error('챌린지별 루틴 완료 조회 실패:', error);
    throw error;
  }
};

// 닉네임으로 루틴 완료 조회
export const getRoutineCompletionsByUser = async (
  nickname: string
): Promise<ApiResponse<RoutineCompletionDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto[]>>(
      `/api/routine-completions?nickname=${nickname}`
    );

    return response.data;
  } catch (error) {
    console.error('루틴 완료 조회 실패:', error);
    throw error;
  }
};

// 루틴 완료 수정 (증명 이미지용)
export const updateRoutineCompletion = async (
  id: number,
  proofImgUrl: string | null
): Promise<ApiResponse<RoutineCompletionDto>> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<RoutineCompletionDto>>(
      `/api/routine-completions/${id}`,
      { proofImgUrl }
    );

    return response.data;
  } catch (error) {
    console.error('루틴 완료 수정 실패:', error);
    throw error;
  }
};

// ID로 루틴 완료 상세 조회
export const getRoutineCompletionById = async (id: number): Promise<ApiResponse<RoutineCompletionDto>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto>>(
      `/api/routine-completions/${id}`
    );

    return response.data;
  } catch (error) {
    console.error('루틴 완료 상세 조회 실패:', error);
    throw error;
  }
};

// 루틴 완료 삭제
export const deleteRoutineCompletion = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/routine-completions/${id}`);
    return response.data;
  } catch (error) {
    console.error('루틴 완료 삭제 실패:', error);
    throw error;
  }
};

// API 편의 객체
export const routineCompletionsApi = {
  create: createRoutineCompletion,
  getByChallenge: getRoutineCompletionsByChallenge,
  getByNickname: getRoutineCompletionsByUser,
  getById: getRoutineCompletionById,
  update: updateRoutineCompletion,
  delete: deleteRoutineCompletion,
};
