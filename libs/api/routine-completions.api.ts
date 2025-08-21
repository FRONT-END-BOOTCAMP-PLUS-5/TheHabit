import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import {
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

// 루틴 완료 생성 (이미지 업로드 포함)
export const createRoutineCompletion = async (
  nickname: string,
  routineId: number,
  content: string,
  photoFile?: File
): Promise<RoutineCompletionDto> => {
  try {
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('routineId', routineId.toString());
    formData.append('content', content);
    
    if (photoFile) {
      formData.append('file', photoFile);
    }

    const response = await axiosInstance.post<ApiResponse<RoutineCompletionDto>>(
      '/api/routine-completions',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
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

// 닉네임으로 루틴 완료 조회 (챌린지 ID 필수)
export const getRoutineCompletionsByUser = async (
  nickname: string,
  challengeId: number
): Promise<RoutineCompletionDto[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto[]>>(
      `/api/routine-completions?nickname=${nickname}&challengeId=${challengeId}`
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
  getByUser: getRoutineCompletionsByUser,
  getById: getRoutineCompletionById,
  update: updateRoutineCompletion,
  delete: deleteRoutineCompletion,
};
