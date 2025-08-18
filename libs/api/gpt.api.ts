import { GPTRequestDto } from '@/backend/gpt/applications/dtos/GPTRequestDto';
import { axiosInstance } from '@/libs/axios/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

export const requestGPT = async (
  requestInput: GPTRequestDto
): Promise<ApiResponse<GPTRequestDto>> => {
  const response = await axiosInstance.post('/api/gpt', {
    gptResponseContent: requestInput.gptResponseContent.join('\n'),
  });

  return response.data;
};
