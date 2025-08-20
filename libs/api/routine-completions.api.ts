import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

// 루틴 완료 생성
export const createRoutineCompletion = async (
  data: CreateRoutineCompletionRequestDto
): Promise<RoutineCompletionDto> => {
  try {
    const response = await axiosInstance.post<ApiResponse<RoutineCompletionDto>>(
      '/api/routine-completions',
      data
    );

    if (!response.data.data) {
      throw new Error('서버에서 반환된 데이터가 없습니다');
    }

    return response.data.data;
  } catch (error) {
    console.error('루틴 완료 생성 실패:', error);
    throw error;
  }
};

// 챌린지별 루틴 완료 조회
export const getRoutineCompletionsByChallenge = async (
  challengeId: number,
  nickname: string
): Promise<RoutineCompletionDto[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto[]>>(
      `/api/routine-completions?challengeId=${challengeId}&nickname=${nickname}`
    );

    if (!response.data.data) {
      throw new Error('서버에서 반환된 데이터가 없습니다');
    }

    return response.data.data;
  } catch (error) {
    console.error('챌린지별 루틴 완료 조회 실패:', error);
    throw error;
  }
};

// 닉네임으로 루틴 완료 조회
export const getRoutineCompletionsByUser = async (
  nickname: string
): Promise<RoutineCompletionDto[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto[]>>(
      `/api/routine-completions?nickname=${nickname}`
    );

    if (!response.data.data) {
      throw new Error('서버에서 반환된 데이터가 없습니다');
    }

    return response.data.data;
  } catch (error) {
    console.error('루틴 완료 조회 실패:', error);
    throw error;
  }
};

// 루틴 완료 수정 (증명 이미지용)
export const updateRoutineCompletion = async (
  id: number,
  proofImgUrl: string | null
): Promise<RoutineCompletionDto> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<RoutineCompletionDto>>(
      `/api/routine-completions/${id}`,
      { proofImgUrl }
    );

    if (!response.data.data) {
      throw new Error('서버에서 반환된 데이터가 없습니다');
    }

    return response.data.data;
  } catch (error) {
    console.error('루틴 완료 수정 실패:', error);
    throw error;
  }
};

// ID로 루틴 완료 상세 조회
export const getRoutineCompletionById = async (id: number): Promise<RoutineCompletionDto> => {
  try {
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto>>(
      `/api/routine-completions/${id}`
    );

    if (!response.data.data) {
      throw new Error('서버에서 반환된 데이터가 없습니다');
    }

    return response.data.data;
  } catch (error) {
    console.error('루틴 완료 상세 조회 실패:', error);
    throw error;
  }
};

// 루틴 완료 삭제
export const deleteRoutineCompletion = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete<ApiResponse<void>>(`/api/routine-completions/${id}`);
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
