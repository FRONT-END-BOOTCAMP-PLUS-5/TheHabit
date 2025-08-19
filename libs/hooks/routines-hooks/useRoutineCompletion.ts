import { useState, useCallback } from 'react';
import {
  useCreateRoutineCompletion,
  useDeleteRoutineCompletion,
} from '@/libs/hooks/routine-completions-hooks';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';

type RoutineCompletion = RoutineCompletionDto;

interface UseRoutineCompletionProps {
  completions: RoutineCompletion[];
  onError?: (message: string) => void;
  nickname: string;
}

export const useRoutineCompletion = ({
  completions,
  onError = msg => alert(msg),
  nickname,
}: UseRoutineCompletionProps) => {
  const createCompletionMutation = useCreateRoutineCompletion();
  const deleteCompletionMutation = useDeleteRoutineCompletion();

  // 루틴 완료 여부 확인
  const isRoutineCompleted = useCallback(
    (routineId: number) => {
      return completions.some(completion => completion.routineId === routineId);
    },
    [completions]
  );

  // 완료된 루틴의 completion 데이터 가져오기
  const getRoutineCompletion = useCallback(
    (routineId: number) => {
      return completions.find(completion => completion.routineId === routineId);
    },
    [completions]
  );

  // 루틴 완료 생성
  const createCompletion = useCallback(
    async (routine: ReadRoutineResponseDto, onSuccess?: () => void) => {
      try {
        await createCompletionMutation.mutateAsync({
          nickname: nickname,
          routineId: routine.id,
          content: '',
        });
        onSuccess?.();
      } catch (error) {
        console.error('루틴 완료 생성 실패:', error);
        onError('루틴 완료 생성에 실패했습니다.');
      }
    },
    [createCompletionMutation, onError]
  );

  // 루틴 완료 삭제
  const deleteCompletion = useCallback(
    async (routineId: number) => {
      try {
        const completion = getRoutineCompletion(routineId);
        if (completion) {
          await deleteCompletionMutation.mutateAsync(completion.id);
        }
      } catch (error) {
        console.error('루틴 완료 삭제 실패:', error);
        onError('루틴 완료 삭제에 실패했습니다.');
      }
    },
    [deleteCompletionMutation, getRoutineCompletion, onError]
  );

  return {
    isRoutineCompleted,
    getRoutineCompletion,
    createCompletion,
    deleteCompletion,
    isCreating: createCompletionMutation.isPending,
    isDeleting: deleteCompletionMutation.isPending,
  };
};
