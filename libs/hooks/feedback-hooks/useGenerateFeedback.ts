import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoutineCompletionDto } from '@/backend/routine-completions/application/dtos/RoutineCompletionDto';
import { FeedBackPostData } from '@/app/user/feedback/_components/FeedBackPostData';

export interface GenerateFeedbackInput {
  challengeId: number;
  routineCompletions: RoutineCompletionDto[];
  nickname: string;
}

export interface GenerateFeedbackResult {
  gptResponseContent: string;
}

export const useGenerateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation<GenerateFeedbackResult, Error, GenerateFeedbackInput>({
    mutationFn: async ({ challengeId, routineCompletions, nickname }) => {
      const result = await FeedBackPostData(challengeId, routineCompletions, nickname);
      return { gptResponseContent: result };
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['feedBack', variables.challengeId] });
    },
  });
};
