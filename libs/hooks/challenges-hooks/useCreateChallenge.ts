import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChallenge } from '@/libs/api/challenges.api';
import { AddChallengeRequestDto } from '@/backend/challenges/applications/dtos/AddChallengeDto';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { Toast } from '@/app/_components/toasts/Toast';

/**
 * 챌린지를 생성하는 훅
 * @returns 챌린지 생성 mutation
 */
export const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      success: boolean;
      data?: ChallengeDto;
      message?: string;
      error?: { code: string; message: string };
    },
    Error,
    AddChallengeRequestDto
  >({
    mutationFn: createChallenge,
    onSuccess: (data, variables) => {
      // 챌린지 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['challenges', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'category'] });

      // Dashboard 관련 쿼리도 무효화하여 실시간 업데이트
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });

      // 특정 사용자의 대시보드 캐시도 무효화
      if (variables.nickname) {
        queryClient.invalidateQueries({ queryKey: ['dashboard', variables.nickname] });
      }

      // 성공 토스트 메시지 표시
      Toast.success('챌린지가 성공적으로 생성되었습니다!');

      console.log('챌린지 생성 성공:', data);
    },
    onError: error => {
      // 에러 토스트 메시지 표시
      Toast.error('챌린지 생성에 실패했습니다. 다시 시도해주세요.');
      console.error('챌린지 생성 실패:', error);
    },
  });
};
