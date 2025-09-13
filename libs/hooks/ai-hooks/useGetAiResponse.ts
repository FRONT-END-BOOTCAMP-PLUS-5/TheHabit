import { requestAI } from '@/libs/api/ai.api';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { AiRequestDto } from '@/backend/ai/application/dtos/AiRequestDto';

export const useGetAiResponse = (AiRequest: AiRequestDto) => {
  return useQuery<ApiResponse<AiRequestDto>>({
    queryKey: ['ai-response', AiRequest?.aiResponseContent ?? ''],
    queryFn: () => requestAI(AiRequest),
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    enabled: Boolean(AiRequest?.aiResponseContent?.trim()),
  });
};
