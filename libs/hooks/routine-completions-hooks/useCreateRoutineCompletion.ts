import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoutineCompletion } from '@/libs/api/routine-completions.api';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import axios from 'axios';

interface CreateRoutineCompletionParams {
  userId: string;
  routineId: number;
  review: string;
  photoFile?: File;
}

/**
 * 루틴 완료를 생성하는 훅 (이미지 업로드 포함)
 * @returns 루틴 완료 생성 mutation
 */
export const useCreateRoutineCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation<RoutineCompletionDto, Error, CreateRoutineCompletionParams>({
    mutationFn: async ({ photoFile, ...rest }) => {
      let proofImgUrl: string | null = null;

      if (photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);

        const { data: uploadData } = await axios.post(
          '/api/routine-completions/image',
          formData,
        );
        proofImgUrl = uploadData.imageUrl;
      }

      const completionData: CreateRoutineCompletionRequestDto = {
        ...rest,
        proofImgUrl,
      };

      return createRoutineCompletion(completionData);
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

      console.log('루틴 완료 생성 성공:', data);
    },
    onError: error => {
      console.error('루틴 완료 생성 실패:', error);
    },
  });
};
