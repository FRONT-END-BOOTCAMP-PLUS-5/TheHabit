import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRoutineCompletion } from '@/libs/api/routine-completions.api';

/**
 * 루틴 완료를 삭제하는 훅 (체크 해제 시 사용)
 * @returns 루틴 완료 삭제 mutation
 */
export const useDeleteRoutineCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteRoutineCompletion,
    onSuccess: (data, completionId) => {
      // 루틴 완료 삭제 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['routine-completions'] });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'challenge'],
      });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'user'],
      });

      console.log('루틴 완료 삭제 성공:', completionId);
    },
    onError: (error) => {
      console.error('루틴 완료 삭제 실패:', error);
    },
  });
};
