import { useMutation } from '@tanstack/react-query';
import { FeedbackApi } from '@/libs/api/feedback.api';

export const useCreateFeedBack = (id: any) => {
  // 챌린지 데이터 가져오기 -> 어떤 챌린지 인지 확인 후 그에 맞게 루틴 가져오기 -> 그 루틴에 대한 피드백 생성
  const mutation = useMutation({
    mutationFn: () => {
      return FeedbackApi(id);
    },
  });

  return {
    mutate: mutation.mutate,
  };
};
