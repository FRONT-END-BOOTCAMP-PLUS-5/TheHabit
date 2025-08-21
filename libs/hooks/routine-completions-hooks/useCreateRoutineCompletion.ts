import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoutineCompletion } from '@/libs/api/routine-completions.api';
import { CreateRoutineCompletionRequestDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

/**
 * 루틴 완료를 생성하는 훅 (이미지 업로드 포함)
 * @returns 루틴 완료 생성 mutation
 */
export const useCreateRoutineCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | CreateRoutineCompletionRequestDto) => 
      createRoutineCompletion(data),
    onSuccess: (data) => {
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
