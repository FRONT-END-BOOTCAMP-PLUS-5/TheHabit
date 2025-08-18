import { useQuery } from '@tanstack/react-query';
import { getFeedBackByChallengeId } from '@/libs/api/feedback.api';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { AddFeedbackDto } from '@/backend/feedbacks/applications/dtos/AddfeedbackDto';

export const useGetFeedBackById = (id: number) => {
  return useQuery<ApiResponse<AddFeedbackDto>>({
    queryKey: ['feedBack', id],
    queryFn: () => getFeedBackByChallengeId(id),
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};
