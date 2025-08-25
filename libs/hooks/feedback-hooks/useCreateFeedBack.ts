import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedbackApi } from '@/libs/api/feedback.api';
import { AddFeedbackDto } from '@/backend/feedbacks/applications/dtos/AddfeedbackDto';

export const useCreateFeedBack = () => {
  const queryClient = useQueryClient();

  // 챌린지 데이터 가져오기 -> 어떤 챌린지 인지 확인 후 그에 맞게 루틴 가져오기 -> 그 루틴에 대한 피드백 생성
  return useMutation<
    {
      success: boolean;
      data?: AddFeedbackDto;
      message?: string;
      error?: { code: string; message: string };
    },
    Error,
    AddFeedbackDto & { nickname: string },
    {
      nickname: string;
    }
  >({
    mutationFn: ({ gptResponseContent, challengeId, nickname }) =>
      FeedbackApi({ gptResponseContent, challengeId }, nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedBack'] });
    },
    onError: error => {
      console.error('피드백 생성 실패:', error);
    },
  });
};
