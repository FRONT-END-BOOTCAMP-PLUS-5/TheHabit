import { useState, useCallback } from 'react';

interface RoutineDto {
  id: number;
  routineTitle: string;
  emoji: number;
  challengeId: number;
  createdAt: string;
  updatedAt: string;
}

interface RoutineModalState {
  isReviewModalOpen: boolean;
  selectedRoutine: RoutineDto | null;
  reviewText: string;
  reviewSubmitting: boolean;
}

interface PhotoModalState {
  isPhotoModalOpen: boolean;
  selectedRoutineForPhoto: RoutineDto | null;
  photoUploading: boolean;
}

export function useModalState() {
  // 소감 작성 모달 상태
  const [routineModal, setRoutineModal] = useState<RoutineModalState>({
    isReviewModalOpen: false,
    selectedRoutine: null,
    reviewText: "",
    reviewSubmitting: false,
  });

  // 인증샷 업로드 모달 상태  
  const [photoModal, setPhotoModal] = useState<PhotoModalState>({
    isPhotoModalOpen: false,
    selectedRoutineForPhoto: null,
    photoUploading: false,
  });

  // 소감 모달 열기
  const openReviewModal = useCallback((routine: RoutineDto) => {
    setRoutineModal({
      isReviewModalOpen: true,
      selectedRoutine: routine,
      reviewText: "",
      reviewSubmitting: false,
    });
  }, []);

  // 소감 모달 닫기
  const closeReviewModal = useCallback(() => {
    setRoutineModal(prev => ({
      ...prev,
      isReviewModalOpen: false,
      selectedRoutine: null,
      reviewText: "",
    }));
  }, []);

  // 소감 텍스트 변경
  const setReviewText = useCallback((text: string) => {
    setRoutineModal(prev => ({ ...prev, reviewText: text }));
  }, []);

  // 소감 제출 중 상태 설정
  const setReviewSubmitting = useCallback((submitting: boolean) => {
    setRoutineModal(prev => ({ ...prev, reviewSubmitting: submitting }));
  }, []);

  // 인증샷 모달 열기
  const openPhotoModal = useCallback((routine: RoutineDto) => {
    setPhotoModal({
      isPhotoModalOpen: true,
      selectedRoutineForPhoto: routine,
      photoUploading: false,
    });
  }, []);

  // 인증샷 모달 닫기
  const closePhotoModal = useCallback(() => {
    setPhotoModal(prev => ({
      ...prev,
      isPhotoModalOpen: false,
      selectedRoutineForPhoto: null,
    }));
  }, []);

  // 인증샷 업로드 중 상태 설정
  const setPhotoUploading = useCallback((uploading: boolean) => {
    setPhotoModal(prev => ({ ...prev, photoUploading: uploading }));
  }, []);

  return {
    routineModal,
    photoModal,
    openReviewModal,
    closeReviewModal,
    setReviewText,
    setReviewSubmitting,
    openPhotoModal,
    closePhotoModal,
    setPhotoUploading,
  };
}