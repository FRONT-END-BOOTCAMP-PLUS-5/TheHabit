"use client";

import { LoadingSpinner } from "@/app/_components/loading/LoadingSpinner";
import { PhotoUploadModal } from "@/app/_components/routine-accordion/PhotoUploadModal";
import { RoutineItem } from "./RoutineItem";
import { ReviewModal } from "./ReviewModal";
import { ErrorBoundary } from "./ErrorBoundary";
import { RoutineListSkeleton } from "./RoutineListSkeleton";
import { useGetRoutinesByChallenge } from "@/libs/hooks/routines-hooks";
import { useGetRoutineCompletionsByChallenge } from "@/libs/hooks/routine-completions-hooks";

// 타입과 상수 import
import { RoutineDto, RoutineAccordionContentProps } from './types';
import { UI_MESSAGES } from '../../../public/consts/routineItem';
import { useRoutineCompletion } from '@/libs/hooks/routine-hooks/useRoutineCompletion';
import { useModalState } from '@/libs/hooks/routine-hooks/useModalState';



function RoutineAccordionContentInner({
  challengeId,
  challengeName,
}: RoutineAccordionContentProps) {
  // 데이터 페칭
  const { data: routines = [], isLoading, error } = useGetRoutinesByChallenge(challengeId);
  const { data: completions = [], isLoading: completionsLoading } = useGetRoutineCompletionsByChallenge(challengeId);
  
  // 커스텀 훅들
  const routineCompletion = useRoutineCompletion({ completions });
  const modalState = useModalState();


  // 이벤트 핸들러들
  const handleRoutineCheck = (checked: boolean, routine: RoutineDto) => {
    if (checked) {
      modalState.openReviewModal(routine);
    } else {
      routineCompletion.deleteCompletion(routine.id);
    }
  };

  const handleReviewSubmit = async () => {
    if (!modalState.routineModal.selectedRoutine) {
      alert("루틴을 선택해주세요.");
      return;
    }

    modalState.setReviewSubmitting(true);
    
    await routineCompletion.createCompletion(
      modalState.routineModal.selectedRoutine,
      modalState.closeReviewModal
    );
    
    modalState.setReviewSubmitting(false);
  };

  const handlePhotoUpload = (routine: RoutineDto) => {
    modalState.openPhotoModal(routine);
  };

  const handlePhotoSubmit = async (photoUrl: string) => {
    if (!modalState.photoModal.selectedRoutineForPhoto) return;

    modalState.setPhotoUploading(true);
    
    try {
      const completion = routineCompletion.getRoutineCompletion(
        modalState.photoModal.selectedRoutineForPhoto.id
      );
      if (completion) {
        // TODO: updateRoutineCompletion API 호출
        console.log("인증샷 업로드:", photoUrl, "for completion:", completion.id);
        alert(UI_MESSAGES.MODAL.PHOTO_UPLOAD_PREPARING);
      }
    } catch (error) {
      console.error("인증샷 업로드 오류:", error);
    } finally {
      modalState.setPhotoUploading(false);
      modalState.closePhotoModal();
    }
  };

  if (isLoading || completionsLoading) {
    return <RoutineListSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p className="mb-2">{UI_MESSAGES.ERROR.LOAD_ROUTINES}</p>
        <p className="text-sm">{error?.message || UI_MESSAGES.ERROR.UNKNOWN}</p>
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="mb-2">등록된 루틴이 없습니다.</p>
        <p className="text-sm">
          "{challengeName}" 챌린지에 루틴을 추가해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          📋 오늘의 루틴
        </h4>

        <div className="space-y-3">
          {routines.map((routine) => {
            const isCompleted = routineCompletion.isRoutineCompleted(routine.id);
            const completion = routineCompletion.getRoutineCompletion(routine.id);

            return (
              <RoutineItem
                key={routine.id}
                routine={routine}
                isCompleted={isCompleted}
                completion={completion}
                onRoutineCheck={handleRoutineCheck}
                onPhotoUpload={handlePhotoUpload}
              />
            );
          })}
        </div>
      </div>

      {/* 소감 작성 모달 */}
      <ReviewModal
        isOpen={modalState.routineModal.isReviewModalOpen}
        selectedRoutine={modalState.routineModal.selectedRoutine}
        reviewText={modalState.routineModal.reviewText}
        isSubmitting={modalState.routineModal.reviewSubmitting}
        onClose={modalState.closeReviewModal}
        onSubmit={handleReviewSubmit}
        onReviewTextChange={modalState.setReviewText}
      />

      {/* 인증샷 업로드 모달 */}
      <PhotoUploadModal
        isOpen={modalState.photoModal.isPhotoModalOpen}
        onClose={modalState.closePhotoModal}
        onUpload={handlePhotoSubmit}
        routineTitle={modalState.photoModal.selectedRoutineForPhoto?.routineTitle || ""}
        loading={modalState.photoModal.photoUploading}
      />
    </div>
  );
}

// 에러 바운더리로 감싼 메인 컴포넌트
export function RoutineAccordionContent(props: RoutineAccordionContentProps) {
  return (
    <ErrorBoundary>
      <RoutineAccordionContentInner {...props} />
    </ErrorBoundary>
  );
}
