"use client";

import { LoadingSpinner } from "@/app/_components/loading/LoadingSpinner";
import { PhotoUploadModal } from "@/app/_components/routine-accordion/PhotoUploadModal";
import { RoutineItem } from "./RoutineItem";
import { ReviewModal } from "./ReviewModal";
import { ErrorBoundary } from "./ErrorBoundary";
import { RoutineListSkeleton } from "./RoutineListSkeleton";
import { useGetRoutinesByChallenge } from "@/libs/hooks/routines-hooks";
import { 
  useGetRoutineCompletionsByChallenge, 
  useCreateRoutineCompletion, 
  useDeleteRoutineCompletion 
} from "@/libs/hooks/routine-completions-hooks";
import { useState } from "react";

// 타입과 상수 import
import { RoutineDto, RoutineAccordionContentProps } from './types';
import { UI_MESSAGES } from '../../../public/consts/routineItem';



function RoutineAccordionContentInner({
  challengeId,
  challengeName,
}: RoutineAccordionContentProps) {
  // 데이터 페칭
  const { data: routines = [], isLoading, error } = useGetRoutinesByChallenge(challengeId);
  const { data: completions = [], isLoading: completionsLoading } = useGetRoutineCompletionsByChallenge(challengeId);
  
  // 뮤테이션 훅들
  const createCompletionMutation = useCreateRoutineCompletion();
  const deleteCompletionMutation = useDeleteRoutineCompletion();
  
  // 모달 상태들
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineDto | null>(null);
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [selectedRoutineForPhoto, setSelectedRoutineForPhoto] = useState<RoutineDto | null>(null);
  const [photoUploading, setPhotoUploading] = useState<boolean>(false);
  
  // 루틴 완료 상태 확인 함수들
  const isRoutineCompleted = (routineId: number) => {
    return completions.some(completion => completion.routineId === routineId);
  };
  
  const getRoutineCompletion = (routineId: number) => {
    return completions.find(completion => completion.routineId === routineId);
  };


  // 이벤트 핸들러들
  const handleRoutineCheck = (checked: boolean, routine: RoutineDto) => {
    if (checked) {
      setSelectedRoutine(routine);
      setIsReviewModalOpen(true);
    } else {
      const completion = getRoutineCompletion(routine.id);
      if (completion) {
        deleteCompletionMutation.mutate(completion.id);
      }
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedRoutine) {
      alert("루틴을 선택해주세요.");
      return;
    }

    setReviewSubmitting(true);
    
    createCompletionMutation.mutate(
      {
        userId: "f1c6b5ae-b27e-4ae3-9e30-0cb8653b04fd", // TODO: 실제 사용자 ID 사용
        routineId: selectedRoutine.id,
        proofImgUrl: null // 현재는 소감만 제출, 추후 리뷰 필드 추가 필요
      },
      {
        onSuccess: () => {
          setIsReviewModalOpen(false);
          setSelectedRoutine(null);
          setReviewText("");
          alert("소감이 제출되었습니다!");
        },
        onError: (error) => {
          console.error("루틴 완료 생성 오류:", error);
          alert("소감 제출에 실패했습니다. 다시 시도해주세요.");
        }
      }
    );
    
    setReviewSubmitting(false);
  };

  const handlePhotoUpload = (routine: RoutineDto) => {
    setSelectedRoutineForPhoto(routine);
    setIsPhotoModalOpen(true);
  };

  const handlePhotoSubmit = async (photoUrl: string) => {
    if (!selectedRoutineForPhoto) return;

    setPhotoUploading(true);
    
    try {
      const completion = getRoutineCompletion(selectedRoutineForPhoto.id);
      if (completion) {
        // TODO: updateRoutineCompletion API 호출
        console.log("인증샷 업로드:", photoUrl, "for completion:", completion.id);
        alert(UI_MESSAGES.MODAL.PHOTO_UPLOAD_PREPARING);
      }
    } catch (error) {
      console.error("인증샷 업로드 오류:", error);
    } finally {
      setPhotoUploading(false);
      setIsPhotoModalOpen(false);
      setSelectedRoutineForPhoto(null);
    }
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedRoutine(null);
    setReviewText("");
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
    setSelectedRoutineForPhoto(null);
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
            const isCompleted = isRoutineCompleted(routine.id);
            const completion = getRoutineCompletion(routine.id);

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
        isOpen={isReviewModalOpen}
        selectedRoutine={selectedRoutine}
        reviewText={reviewText}
        isSubmitting={reviewSubmitting}
        onClose={closeReviewModal}
        onSubmit={handleReviewSubmit}
        onReviewTextChange={setReviewText}
      />

      {/* 인증샷 업로드 모달 */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={closePhotoModal}
        onUpload={handlePhotoSubmit}
        routineTitle={selectedRoutineForPhoto?.routineTitle || ""}
        loading={photoUploading}
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
