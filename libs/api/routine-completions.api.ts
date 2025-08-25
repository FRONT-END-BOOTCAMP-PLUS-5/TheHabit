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
      // FormData일 때는 헤더를 설정하지 않음 (브라우저가 자동으로 설정)
      isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('루틴 완료 생성 실패:', error);
    throw error;
  }
};

// 루틴 완료 조회 (닉네임 기반 - 모든 루틴 완료)
export const getRoutineCompletionsByNickname = async (
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

// 루틴 완료 조회 (챌린지 ID와 닉네임 기반 - 기존 호환성)
export const getRoutineCompletions = async (
  challengeId: number,
  nickname: string
): Promise<ApiResponse<RoutineCompletionDto[]>> => {
  try {
    // 새로운 API 구조에서는 nickname만 사용
    // challengeId는 클라이언트에서 필터링하도록 변경
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto[]>>(
      `/api/routine-completions?nickname=${nickname}`
    );

    // 클라이언트에서 challengeId로 필터링
    // 현재 DTO에는 routine 정보가 없으므로, 모든 루틴 완료를 반환
    // 실제 필터링은 상위 컴포넌트에서 처리해야 함
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
  getByNickname: getRoutineCompletionsByNickname,
  update: updateRoutineCompletion,
  delete: deleteRoutineCompletion,
};
