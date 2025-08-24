import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoutineCompletionDto, CreateRoutineCompletionRequestDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { createRoutineCompletion } from '@/libs/api/routine-completions.api';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

/**
 * 루틴 완료를 생성하는 훅
 * @returns 루틴 완료 생성 mutation
 */
export const useCreateRoutineCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<RoutineCompletionDto>, Error, FormData | CreateRoutineCompletionRequestDto>({
    mutationFn: (data: FormData | CreateRoutineCompletionRequestDto) => 
      createRoutineCompletion(data),
    onSuccess: () => {
      // 루틴 완료 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['routine-completions'] });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'challenge'],
      });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'user'],
      });
    },
    onError: error => {
      console.error('루틴 완료 생성 실패:', error);
    },
  });
};
