import { axiosInstance } from "@/libs/axios/axiosInstance";
import {
  CreateRoutineCompletionRequestDto,
  CreateRoutineCompletionResponseDto,
} from "@/backend/routine-completions/applications/dtos/RoutineCompletionDto";

// Create routine completion
export const createRoutineCompletion = async (
  data: CreateRoutineCompletionRequestDto
): Promise<CreateRoutineCompletionResponseDto> => {
  try {
    const response = await axiosInstance.post<CreateRoutineCompletionResponseDto>(
      "/api/routine-completions",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create routine completion:", error);
    throw error;
  }
};

// Get routine completions by challenge
export const getRoutineCompletionsByChallenge = async (
  challengeId: number
): Promise<CreateRoutineCompletionResponseDto[]> => {
  try {
    const response = await axiosInstance.get<CreateRoutineCompletionResponseDto[]>(
      `/api/routine-completions?challengeId=${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get routine completions by challenge:", error);
    throw error;
  }
};

// Get routine completions by user
export const getRoutineCompletionsByUser = async (
  userId: string
): Promise<CreateRoutineCompletionResponseDto[]> => {
  try {
    const response = await axiosInstance.get<CreateRoutineCompletionResponseDto[]>(
      `/api/routine-completions?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get routine completions by user:", error);
    throw error;
  }
};

// Update routine completion (for proof image)
export const updateRoutineCompletion = async (
  id: number,
  proofImgUrl: string | null
): Promise<CreateRoutineCompletionResponseDto> => {
  try {
    const response = await axiosInstance.patch<CreateRoutineCompletionResponseDto>(
      `/api/routine-completions/${id}`,
      { proofImgUrl }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update routine completion:", error);
    throw error;
  }
};

// Delete routine completion
export const deleteRoutineCompletion = async (
  id: number
): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/routine-completions/${id}`);
  } catch (error) {
    console.error("Failed to delete routine completion:", error);
    throw error;
  }
};

// API object for convenience
export const routineCompletionsApi = {
  create: createRoutineCompletion,
  getByChallenge: getRoutineCompletionsByChallenge,
  getByUser: getRoutineCompletionsByUser,
  update: updateRoutineCompletion,
  delete: deleteRoutineCompletion,
};