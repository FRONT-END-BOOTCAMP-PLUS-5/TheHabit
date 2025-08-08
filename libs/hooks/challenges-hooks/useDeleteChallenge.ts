import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteChallenge } from '@/libs/api/challenges.api';

/**
 * 챌린지를 삭제하는 훅
 * @returns 챌린지 삭제 mutation
 */
export const useDeleteChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message?: string; error?: { code: string; message: string } }, Error, number>({
    mutationFn: deleteChallenge,
    onSuccess: (data, deletedId) => {
      // 챌린지 삭제 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['challenges', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'category'] });

      // 삭제된 챌린지의 상세 캐시 제거
      queryClient.removeQueries({ queryKey: ['challenges', 'detail', deletedId] });

      console.log('챌린지 삭제 성공:', data);
    },
    onError: (error) => {
      console.error('챌린지 삭제 실패:', error);
    },
  });
}; 