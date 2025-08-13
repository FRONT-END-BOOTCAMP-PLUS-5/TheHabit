'use client';

import { useState, useCallback } from 'react';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';

export interface UseModalStateReturn {
  isCompletionModalOpen: boolean;
  selectedRoutine: ReadRoutineResponseDto | null;
  openModal: (routine: ReadRoutineResponseDto) => void;
  closeModal: () => void;
}

export const useModalState = (): UseModalStateReturn => {
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState<boolean>(false);
  const [selectedRoutine, setSelectedRoutine] = useState<ReadRoutineResponseDto | null>(null);

  const openModal = useCallback((routine: ReadRoutineResponseDto) => {
    setSelectedRoutine(routine);
    setIsCompletionModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsCompletionModalOpen(false);
    setSelectedRoutine(null);
  }, []);

  return {
    isCompletionModalOpen,
    selectedRoutine,
    openModal,
    closeModal,
  };
};