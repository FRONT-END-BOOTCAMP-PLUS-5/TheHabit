import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ChallengeDto } from '@/backend/challenges/application/dtos/ChallengeDto';
import { AddChallengeRequestDto } from '@/backend/challenges/application/dtos/AddChallengeDto';

// API 응답 타입 정의
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

interface CategoryChallengesResponse {
  success: boolean;
  data?: ChallengeDto[];
  message?: string;
  count?: number;
  error?: {
    code: string;
    message: string;
  };
}

// 1. 전체 챌린지 목록 조회
export const getAllChallenges = async (): Promise<ChallengeDto[]> => {
  try {
    const response = await axiosInstance.get<ChallengeDto[]>('/api/challenges');
    return response.data;
  } catch (error) {
    console.error('전체 챌린지 조회 실패:', error);
    throw error;
  }
};

// 2. 챌린지 생성
export const createChallenge = async (
  challengeData: AddChallengeRequestDto
): Promise<ApiResponse<ChallengeDto>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<ChallengeDto>>(
      '/api/challenges',
      challengeData
    );
    return response.data;
  } catch (error) {
    console.error('챌린지 생성 실패:', error);
    throw error;
  }
};

// 3. 특정 챌린지 상세 조회
export const getChallengeById = async (id: number): Promise<ApiResponse<ChallengeDto>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ChallengeDto>>(`/api/challenges?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('챌린지 상세 조회 실패:', error);
    throw error;
  }
};

// 4. 챌린지 수정
export const updateChallenge = async (
  id: number,
  challengeData: Partial<AddChallengeRequestDto>
): Promise<ApiResponse<ChallengeDto>> => {
  try {
    const response = await axiosInstance.put<ApiResponse<ChallengeDto>>(
      `/api/challenges/${id}`,
      challengeData
    );
    return response.data;
  } catch (error) {
    console.error('챌린지 수정 실패:', error);
    throw error;
  }
};

// 5. 챌린지 삭제
export const deleteChallenge = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error('챌린지 삭제 실패:', error);
    throw error;
  }
};

// 6. 카테고리별 챌린지 목록 조회
export const getChallengesByCategory = async (
  categoryId: number
): Promise<CategoryChallengesResponse> => {
  try {
    const response = await axiosInstance.get<CategoryChallengesResponse>(
      `/api/challenges/categories/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error('카테고리별 챌린지 조회 실패:', error);
    throw error;
  }
};

// 7. 챌린지 연장 (21일 → 66일, 66일 → 무제한)
export const extendChallenge = async (
  nickname: string,
  challengeId: number
): Promise<ApiResponse<ChallengeDto>> => {
  try {
    const response = await axiosInstance.put<ApiResponse<ChallengeDto>>(
      `/api/challenges/${nickname}/${challengeId}?action=extend`
    );
    return response.data;
  } catch (error) {
    console.error('챌린지 연장 실패:', error);
    throw error;
  }
};

// 8. 챌린지 완료
export const completeChallenge = async (
  nickname: string,
  challengeId: number
): Promise<ApiResponse<ChallengeDto>> => {
  try {
    const response = await axiosInstance.put<ApiResponse<ChallengeDto>>(
      `/api/challenges/${nickname}/${challengeId}?action=complete`
    );
    return response.data;
  } catch (error) {
    console.error('챌린지 완료 실패:', error);
    throw error;
  }
};

export const getChallengesByNickname = async (nickname: string): Promise<ChallengeDto[]> => {
  try {
    const response = await axiosInstance.get<ChallengeDto[]>(`/api/challenges/${nickname}`);
    return response.data;
  } catch (error) {
    console.error('닉네임으로 챌린지 조회 실패:', error);
    throw error;
  }
};

// 편의 함수들
export const challengesApi = {
  getAll: getAllChallenges,
  create: createChallenge,
  getById: getChallengeById,
  update: updateChallenge,
  delete: deleteChallenge,
  getByCategory: getChallengesByCategory,
  getByNickname: getChallengesByNickname,
  extend: extendChallenge,
  complete: completeChallenge,
};
