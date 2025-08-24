import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import {
  RoutineCompletionDto,
  CreateRoutineCompletionRequestDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

// 루틴 완료 생성 (이미지 업로드 포함)
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

// 루틴 완료 조회 (챌린지 ID와 닉네임 기반)
export const getRoutineCompletions = async (
  challengeId: number,
  nickname: string
): Promise<ApiResponse<RoutineCompletionDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto[]>>(
      `/api/routine-completions?challengeId=${challengeId}&nickname=${nickname}`
    );

    return response.data;
  } catch (error) {
    console.error('루틴 완료 조회 실패:', error);
    throw error;
  }
};

// 루틴 완료 수정 (증명 이미지용)
export const updateRoutineCompletion = async (
  completionId: number,
  proofImgUrl: string | null
): Promise<ApiResponse<RoutineCompletionDto>> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<RoutineCompletionDto>>(
      '/api/routine-completions',
      { completionId, proofImgUrl }
    );

    return response.data;
  } catch (error) {
    console.error('루틴 완료 수정 실패:', error);
    throw error;
  }
};


// 루틴 완료 삭제
export const deleteRoutineCompletion = async (completionId: number): Promise<void> => {
  try {
    await axiosInstance.delete<ApiResponse<void>>('/api/routine-completions', {
      data: { completionId }
    });
  } catch (error) {
    console.error('루틴 완료 삭제 실패:', error);
    throw error;
  }
};

// API 편의 객체
export const routineCompletionsApi = {
  create: createRoutineCompletion,
  get: getRoutineCompletions,
  update: updateRoutineCompletion,
  delete: deleteRoutineCompletion,
};
