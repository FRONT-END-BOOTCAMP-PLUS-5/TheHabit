import { requestGPT } from '@/libs/api/gpt.api';
import { GPTRequestDto } from '@/backend/gpt/application/dtos/GPTRequestDto';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

export const useGetGptResponse = (gptRequest: GPTRequestDto) => {
  return useQuery<ApiResponse<GPTRequestDto>>({
    queryKey: ['gpt-response', gptRequest?.gptResponseContent ?? ''],
    queryFn: () => requestGPT(gptRequest),
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    enabled: Boolean(gptRequest?.gptResponseContent?.trim()),
  });
};
