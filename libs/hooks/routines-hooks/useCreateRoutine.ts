import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoutine } from '@/libs/api/routines.api';
import {
  CreateRoutineRequestDto,
  ReadRoutineResponseDto,
} from '@/backend/routines/applications/dtos/RoutineDto';

/**
 * 루틴을 생성하는 훅
 * @returns 루틴 생성 mutation
 */
export const useCreateRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      success: boolean;
      data?: ReadRoutineResponseDto;
      message?: string;
      error?: { code: string; message: string };
    },
    Error,
    CreateRoutineRequestDto
  >({
    mutationFn: createRoutine,
    onSuccess: (data, variables) => {
      // 루틴 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['routines', 'all'] });
      queryClient.invalidateQueries({
        queryKey: ['routines', 'challenge', variables.challengeId],
      });
      queryClient.invalidateQueries({ queryKey: ['routines', 'dashboard'] });

      console.log('루틴 생성 성공:', data);
    },
    onError: (error) => {
      console.error('루틴 생성 실패:', error);
    },
  });
};
