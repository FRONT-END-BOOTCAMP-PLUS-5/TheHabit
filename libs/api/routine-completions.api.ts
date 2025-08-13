import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

// Create routine completion
export const createRoutineCompletion = async (
  data: CreateRoutineCompletionRequestDto,
): Promise<RoutineCompletionDto> => {
  try {
    const response =
      await axiosInstance.post<RoutineCompletionDto>(
        '/api/routine-completions',
        data,
      );
    return response.data;
  } catch (error) {
    console.error('Failed to create routine completion:', error);
    throw error;
  }
};

// Get routine completions by challenge
export const getRoutineCompletionsByChallenge = async (
  challengeId: number,
): Promise<RoutineCompletionDto[]> => {
  try {
    const response = await axiosInstance.get<
      RoutineCompletionDto[]
    >(`/api/routine-completions?challengeId=${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get routine completions by challenge:', error);
    throw error;
  }
};

// Get routine completions by user
export const getRoutineCompletionsByUser = async (
  userId: string,
): Promise<RoutineCompletionDto[]> => {
  try {
    const response = await axiosInstance.get<
      RoutineCompletionDto[]
    >(`/api/routine-completions?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get routine completions by user:', error);
    throw error;
  }
};

// Update routine completion (for proof image)
export const updateRoutineCompletion = async (
  id: number,
  proofImgUrl: string | null,
): Promise<RoutineCompletionDto> => {
  try {
    const response = await axiosInstance.patch<
      ApiResponse<RoutineCompletionDto>
    >(`/api/routine-completions/${id}`, { proofImgUrl });
    
    if (!response.data.data) {
      throw new Error('No data returned from server');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Failed to update routine completion:', error);
    throw error;
  }
};

// Get routine completion by ID
export const getRoutineCompletionById = async (
  id: number,
): Promise<RoutineCompletionDto> => {
  try {
    const response = await axiosInstance.get<ApiResponse<RoutineCompletionDto>>(
      `/api/routine-completions/${id}`,
    );
    
    if (!response.data.data) {
      throw new Error('No data returned from server');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Failed to get routine completion:', error);
    throw error;
  }
};

// Delete routine completion
export const deleteRoutineCompletion = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete<ApiResponse<void>>(
      `/api/routine-completions/${id}`,
    );
  } catch (error) {
    console.error('Failed to delete routine completion:', error);
    throw error;
  }
};

// API object for convenience
export const routineCompletionsApi = {
  create: createRoutineCompletion,
  getByChallenge: getRoutineCompletionsByChallenge,
  getByUser: getRoutineCompletionsByUser,
  getById: getRoutineCompletionById,
  update: updateRoutineCompletion,
  delete: deleteRoutineCompletion,
};
