import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { FeedBackPostData } from '@/app/user/feedback/_components/FeedBackPostData';

export interface GenerateFeedbackInput {
  challengeId: number;
  routineCompletions: RoutineCompletionDto[];
  nickname: string;
}

export interface GenerateFeedbackResult {
  gptResponseContent?: string;
}

export const useGenerateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation<GenerateFeedbackResult | void, Error, GenerateFeedbackInput>({
    mutationFn: async ({ challengeId, routineCompletions, nickname }) => {
      const result = await FeedBackPostData(challengeId, routineCompletions, nickname);
      // FeedBackPostData may return string or undefined; normalize to object
      if (typeof result === 'string') {
        return { gptResponseContent: result };
      }
      return;
    },
    onSuccess: async (_data, variables) => {
      // Invalidate specific feedback query so detail page shows fresh data
      await queryClient.invalidateQueries({ queryKey: ['feedBack', variables.challengeId] });
    },
  });
};
