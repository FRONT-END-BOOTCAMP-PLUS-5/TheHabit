import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRoutine } from '@/libs/api/routines.api';
import { UpdateRoutineRequestDto, UpdateRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';

/**
 * 루틴을 수정하는 훅
 * @returns 루틴 수정 mutation
 */
export const useUpdateRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data?: UpdateRoutineResponseDto; message?: string; error?: { code: string; message: string } }, Error, { id: number; data: UpdateRoutineRequestDto }>({
    mutationFn: ({ id, data }) => updateRoutine(id, data),
    onSuccess: (data, variables) => {
      // 루틴 수정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['routines', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['routines', 'detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['routines', 'challenge'] });
      queryClient.invalidateQueries({ queryKey: ['routines', 'dashboard'] });

      console.log('루틴 수정 성공:', data);
    },
    onError: (error) => {
      console.error('루틴 수정 실패:', error);
    },
  });
};