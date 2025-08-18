import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import {
  CreateRoutineRequestDto,
  ReadRoutineResponseDto,
  UpdateRoutineRequestDto,
  DashboardRoutineDto,
} from '@/backend/routines/applications/dtos/RoutineDto';

<<<<<<< HEAD
// 1. 닉네임으로 모든 루틴 조회
export const getAllRoutines = async (nickname: string): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response =
      await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>(`/api/routines?nickname=${nickname}`);
=======
// 1. Get all routines
export const getAllRoutines = async (): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response =
      await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>('/api/routines');
>>>>>>> b9770f4b8d1e5bfe14a78b59758ef31282c71ff0
    return response.data;
  } catch (error) {
    console.error('전체 루틴 조회 실패:', error);
    throw error;
  }
};

// 2. 챌린지 ID로 루틴 조회
export const getRoutinesByChallenge = async (
<<<<<<< HEAD
  challengeId: number,
  nickname: string
): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>(
      `/api/routines?challengeId=${challengeId}&nickname=${nickname}`,
=======
  challengeId: number
): Promise<ReadRoutineResponseDto[]> => {
  try {
    const response = await axiosInstance.get<ReadRoutineResponseDto[]>(
      `/api/routines?challengeId=${challengeId}`
>>>>>>> b9770f4b8d1e5bfe14a78b59758ef31282c71ff0
    );
    return response.data;
  } catch (error) {
    console.error('챌린지별 루틴 조회 실패:', error);
    throw error;
  }
};

// 3. 닉네임으로 사용자 루틴 조회
export const getRoutinesByUser = async (
<<<<<<< HEAD
  nickname: string
): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>(
      `/api/routines?nickname=${nickname}`
=======
  userId: string
): Promise<ApiResponse<ReadRoutineResponseDto[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ReadRoutineResponseDto[]>>(
      `/api/routines?userId=${userId}`
>>>>>>> b9770f4b8d1e5bfe14a78b59758ef31282c71ff0
    );
    return response.data;
  } catch (error) {
    console.error('사용자별 루틴 조회 실패:', error);
    throw error;
  }
};

<<<<<<< HEAD
// 4. ID로 루틴 상세 조회
=======
// 4. Get routine by ID
>>>>>>> b9770f4b8d1e5bfe14a78b59758ef31282c71ff0
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

// 5. 루틴 생성
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

// 6. 루틴 수정
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

<<<<<<< HEAD
// 7. 루틴 삭제
=======
// 7. Delete routine
>>>>>>> b9770f4b8d1e5bfe14a78b59758ef31282c71ff0
export const deleteRoutine = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/routines/${id}`);
    return response.data;
  } catch (error) {
    console.error('루틴 삭제 실패:', error);
    throw error;
  }
};

// 8. 대시보드 루틴 조회 (완료 상태 포함)
export const getDashboardRoutines = async (
<<<<<<< HEAD
  nickname: string,
  challengeId?: number
=======
  challengeId?: number,
  userId?: string
>>>>>>> b9770f4b8d1e5bfe14a78b59758ef31282c71ff0
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

// API 편의 객체
export const routinesApi = {
  getAll: getAllRoutines,
  getByChallenge: getRoutinesByChallenge,
  getByNickname: getRoutinesByUser,
  getById: getRoutineById,
  getDashboard: getDashboardRoutines,
  create: createRoutine,
  update: updateRoutine,
  delete: deleteRoutine,
};
