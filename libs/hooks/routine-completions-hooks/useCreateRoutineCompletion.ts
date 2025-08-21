import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoutineCompletion } from '@/libs/api/routine-completions.api';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

interface CreateRoutineCompletionHookParams {
  nickname: string;
  routineId: number;
  content: string;
  photoFile?: File;
}

/**
 * 루틴 완료를 생성하는 훅
 * @returns 루틴 완료 생성 mutation
 */
export const useCreateRoutineCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation<RoutineCompletionDto, Error, CreateRoutineCompletionHookParams>({
    mutationFn: async ({
      nickname,
      routineId,
      content,
      photoFile,
    }: CreateRoutineCompletionHookParams) => {
      return await createRoutineCompletion(nickname, routineId, content, photoFile);
    },
    onSuccess: data => {
      // 루틴 완료 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['routine-completions'] });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'challenge'],
      });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'user'],
      });

      console.log('루틴 완료 생성 성공:', data);
    },
    onError: error => {
      console.error('루틴 완료 생성 실패:', error);
    },
  });
};
