import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateRoutineCompletionRequestDto,
  RoutineCompletionDto,
} from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import axios from 'axios';

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
      // FormData로 직접 API 요청
      const formData = new FormData();
      formData.append('nickname', nickname);
      formData.append('routineId', routineId.toString());
      formData.append('content', content);
      
      if (photoFile) {
        formData.append('file', photoFile);
      }

      const response = await axios.post<ApiResponse<RoutineCompletionDto>>(
        '/api/routine-completions',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data.data) {
        throw new Error('서버에서 반환된 데이터가 없습니다');
      }

      return response.data.data;
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
