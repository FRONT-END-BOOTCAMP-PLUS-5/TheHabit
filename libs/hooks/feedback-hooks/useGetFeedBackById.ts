import { useQuery } from '@tanstack/react-query';
import { getFeedBackByChallengeId } from '@/libs/api/feedback.api';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { AddFeedbackDto } from '@/backend/feedbacks/applications/dtos/AddfeedbackDto';

export const useGetFeedBackById = (id: number, nickname: string) => {
  return useQuery<ApiResponse<AddFeedbackDto>>({
    queryKey: ['feedBack', id, nickname],
    queryFn: () => getFeedBackByChallengeId(id, nickname),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
