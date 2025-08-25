import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoutineCompletionDto, CreateRoutineCompletionRequestDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { createRoutineCompletion } from '@/libs/api/routine-completions.api';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { Toast } from '@/app/_components/toasts/Toast';
/**
 * 루틴 완료를 생성하는 훅
 * @returns 루틴 완료 생성 mutation
 */
export const useCreateRoutineCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<RoutineCompletionDto>, Error, FormData | CreateRoutineCompletionRequestDto>({
    mutationFn: (data: FormData | CreateRoutineCompletionRequestDto) =>
      createRoutineCompletion(data),
    onSuccess: (data, variables) => {
      // 루틴 완료 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['routine-completions'] });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'challenge'],
      });
      queryClient.invalidateQueries({
        queryKey: ['routine-completions', 'user'],
      });

      // 대시보드 캐시 무효화 (정확한 쿼리 키 사용)
      if (typeof variables === 'object' && 'nickname' in variables) {
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'nickname', variables.nickname] });
      }

      // 추가적인 캐시 무효화로 UI 업데이트 보장
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });

      // 성공 토스트 메시지 표시
      Toast.success('루틴이 성공적으로 완료되었습니다! 🎉');

      console.log('루틴 완료 생성 성공:', data);
    },
    onError: error => {
      console.error('루틴 완료 생성 실패:', error);
    },
  });
};
