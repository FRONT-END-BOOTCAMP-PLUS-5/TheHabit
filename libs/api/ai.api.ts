import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { AiRequestDto } from '@/backend/ai/application/dtos/AiRequestDto';

export const requestGPT = async (
  requestInput: AiRequestDto
): Promise<ApiResponse<AiRequestDto>> => {
  const response = await axiosInstance.post('/api/ai', {
    aiResponseContent: requestInput.aiResponseContent,
  });

  return response.data;
};
