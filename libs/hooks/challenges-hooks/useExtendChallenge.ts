import { useMutation, useQueryClient } from '@tanstack/react-query';
import { extendChallenge } from '@/libs/api/challenges.api';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import { Toast } from '@/app/_components/toasts/Toast';

interface UseExtendChallengeProps {
  nickname: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useExtendChallenge = ({ nickname, onSuccess, onError }: UseExtendChallengeProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (challengeId: number) => extendChallenge(nickname, challengeId),
    onSuccess: (data) => {
      // 성공 시 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['challenges', nickname] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', nickname] });

      // 성공 메시지 표시
      Toast.success(data.message || '챌린지가 성공적으로 연장되었습니다!');

      // 콜백 실행
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('챌린지 연장 실패:', error);

      // 에러 메시지 표시
      Toast.error(error.message || '챌린지 연장에 실패했습니다.');

      // 에러 콜백 실행
      onError?.(error);
    },
  });
};

