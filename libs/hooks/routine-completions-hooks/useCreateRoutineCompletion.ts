import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { createRoutineCompletion } from '@/libs/api/routine-completions.api';
import { Toast } from '@/app/_components/toasts/Toast';

/**
 * 루틴 완료를 생성하는 훅
 * @returns 루틴 완료 생성 mutation
 */
export const useCreateRoutineCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation<RoutineCompletionDto, Error, {
    nickname: string;
    routineId: number;
    content: string;
    photoFile?: File;
  }>({
    mutationFn: async ({ nickname, routineId, content, photoFile }) => {
      return await createRoutineCompletion({ nickname, routineId, content, photoFile });
    },
    onSuccess: (data, variables) => {
      // 루틴 완료 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['routine-completions'] });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'challenge'],
      });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'user'],
      });

      // 대시보드 캐시도 무효화하여 완료 상태 반영
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.nickname] });

      // 성공 토스트 메시지 표시
      Toast.success('루틴이 성공적으로 완료되었습니다! 🎉');

      console.log('루틴 완료 생성 성공:', data);
    },
    onError: error => {
      // 에러 토스트 메시지 표시
      Toast.error('루틴 완료 처리에 실패했습니다. 다시 시도해주세요.');
      console.error('루틴 완료 생성 실패:', error);
    },
  });
};
