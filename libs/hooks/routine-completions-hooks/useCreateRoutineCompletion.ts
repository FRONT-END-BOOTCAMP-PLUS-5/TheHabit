import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { createRoutineCompletion } from '@/libs/api/routine-completions.api';

interface CreateRoutineCompletionParams {
  nickname: string;
  routineId: number;
  content: string;
  photoFile?: File;
}

/**
 * 루틴 완료를 생성하는 훅 (이미지 업로드 포함)
 * @returns 루틴 완료 생성 mutation
 */
export const useCreateRoutineCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation<RoutineCompletionDto, Error, CreateRoutineCompletionParams>({
    mutationFn: async ({ nickname, routineId, content, photoFile }) => {
      return await createRoutineCompletion({
        nickname,
        routineId,
        content,
        proofImgUrl: null, // 파일이 있으면 서버에서 처리
        file: photoFile,
      });
    },
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
