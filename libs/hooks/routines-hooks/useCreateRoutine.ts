import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoutine } from '@/libs/api/routines.api';
import {
  CreateRoutineRequestDto,
  ReadRoutineResponseDto,
} from '@/backend/routines/application/dtos/RoutineDto';
import { Toast } from '@/app/_components/toasts/Toast';

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

      // 대시보드 캐시도 무효화하여 새로운 목록을 받아오도록 함
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.nickname] });

      // 성공 토스트 메시지 표시
      Toast.success('루틴이 성공적으로 생성되었습니다!');

      console.log('루틴 생성 성공:', data);
    },
    onError: error => {
      // 에러 토스트 메시지 표시
      Toast.error('루틴 생성에 실패했습니다. 다시 시도해주세요.');
      console.error('루틴 생성 실패:', error);
    },
  });
};
