import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRoutine } from '@/libs/api/routines.api';
import { DeleteRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';

/**
 * 루틴을 삭제하는 훅
 * @returns 루틴 삭제 mutation
 */
export const useDeleteRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data?: DeleteRoutineResponseDto; message?: string; error?: { code: string; message: string } }, Error, number>({
    mutationFn: deleteRoutine,
    onSuccess: (data, routineId) => {
      // 루틴 삭제 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['routines', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['routines', 'detail', routineId] });
      queryClient.invalidateQueries({ queryKey: ['routines', 'challenge'] });
      queryClient.invalidateQueries({ queryKey: ['routines', 'dashboard'] });

      console.log('루틴 삭제 성공:', data);
    },
    onError: (error) => {
      console.error('루틴 삭제 실패:', error);
    },
  });
};