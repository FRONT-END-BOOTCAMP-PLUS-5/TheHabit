import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { AiRequestDto } from '@/backend/ai/application/dtos/AiRequestDto';
import { AI_PROVIDER } from '@/public/consts/AiProvider';

export const requestAI = async (requestInput: AiRequestDto): Promise<ApiResponse<AiRequestDto>> => {
  const response = await axiosInstance.post('/api/ai', {
    aiResponseContent: requestInput.aiResponseContent,
    provider: AI_PROVIDER.GEMINI,
  });

  return response.data;
};
