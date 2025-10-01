import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeChallenge } from '@/libs/api/challenges.api';
import { ChallengeDto } from '@/backend/challenges/application/dtos/ChallengeDto';
import { Toast } from '@/app/_components/toasts/Toast';

export const useCompleteChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation<ChallengeDto, Error, { nickname: string; challengeId: number }>({
    mutationFn: async ({ nickname, challengeId }) => {
      const response = await completeChallenge(nickname, challengeId);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error?.message || '챌린지 완료에 실패했습니다.');
      }
    },
    onSuccess: (data, variables) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', variables.nickname] });

      Toast.success('챌린지가 성공적으로 완료되었습니다! 🎉');
      console.log('챌린지 완료 성공:', data);
    },
    onError: error => {
      Toast.error('챌린지 완료에 실패했습니다: ' + error.message);
      console.error('챌린지 완료 실패:', error);
    },
  });
};

