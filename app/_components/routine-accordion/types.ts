import { ReadRoutineResponseDto } from "@/backend/routines/applications/dtos/RoutineDto";
import { CreateRoutineCompletionResponseDto } from "@/backend/routine-completions/applications/dtos/RoutineCompletionDto";

// UI 전용 Props 타입들
export interface RoutineAccordionContentProps {
  challengeId: number;
  challengeName: string;
}

export interface RoutineModalState {
  isReviewModalOpen: boolean;
  selectedRoutine: ReadRoutineResponseDto | null;
  reviewText: string;
  reviewSubmitting: boolean;
}

export interface PhotoModalState {
  isPhotoModalOpen: boolean;
  selectedRoutineForPhoto: ReadRoutineResponseDto | null;
  photoUploading: boolean;
}

// 백엔드 DTO 타입 재사용
export type RoutineDto = ReadRoutineResponseDto;
export type RoutineCompletion = CreateRoutineCompletionResponseDto;