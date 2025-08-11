import { CreateRoutineCompletionResponseDto } from "@/backend/routine-completions/applications/dtos/RoutineCompletionDto";

export interface RoutineDto {
  id: number;
  routineTitle: string;
  emoji: number;
  challengeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineAccordionContentProps {
  challengeId: number;
  challengeName: string;
}

export interface RoutineModalState {
  isReviewModalOpen: boolean;
  selectedRoutine: RoutineDto | null;
  reviewText: string;
  reviewSubmitting: boolean;
}

export interface PhotoModalState {
  isPhotoModalOpen: boolean;
  selectedRoutineForPhoto: RoutineDto | null;
  photoUploading: boolean;
}

export type RoutineCompletion = CreateRoutineCompletionResponseDto;