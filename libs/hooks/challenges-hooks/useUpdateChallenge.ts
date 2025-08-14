import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateChallenge } from '@/libs/api/challenges.api';
import { AddChallengeRequestDto } from '@/backend/challenges/applications/dtos/AddChallengeDto';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';

interface UpdateChallengeParams {
  id: number;
  data: Partial<AddChallengeRequestDto>;
}

/**
 * 챌린지를 수정하는 훅
 * @returns 챌린지 수정 mutation
 */
export const useUpdateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      success: boolean;
      data?: ChallengeDto;
      message?: string;
      error?: { code: string; message: string };
    },
    Error,
    UpdateChallengeParams
  >({
    mutationFn: ({ id, data }) => updateChallenge(id, data),
    onSuccess: (data, variables) => {
      // 챌린지 수정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['challenges', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'category'] });
      queryClient.invalidateQueries({
        queryKey: ['challenges', 'detail', variables.id],
      });

      console.log('챌린지 수정 성공:', data);
    },
    onError: error => {
      console.error('챌린지 수정 실패:', error);
    },
  });
};
