import { useQuery } from '@tanstack/react-query';
import { getFeedBackByChallengeId } from '@/libs/api/feedback.api';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { FeedbackDto } from '@/backend/feedbacks/application/dtos/FeedbackDto';

export const useGetFeedBackById = (id: number, nickname: string) => {
  return useQuery<ApiResponse<FeedbackDto>>({
    queryKey: ['feedBack', id, nickname],
    queryFn: () => getFeedBackByChallengeId(id, nickname),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
