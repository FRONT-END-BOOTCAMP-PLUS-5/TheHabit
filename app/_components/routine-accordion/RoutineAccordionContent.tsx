'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/app/_components/loading/LoadingSpinner';
import { RoutineItem } from './RoutineItem';
import { RoutineCompletionModal } from './RoutineCompletionModal';
import { ErrorBoundary } from './ErrorBoundary';
import { RoutineListSkeleton } from './RoutineListSkeleton';
import { useGetRoutinesByChallenge } from '@/libs/hooks/routines-hooks';
import {
  useGetRoutineCompletionsByChallenge,
  useCreateRoutineCompletion,
  useDeleteRoutineCompletion,
} from '@/libs/hooks/routine-completions-hooks';

// 타입과 상수 import
import { RoutineAccordionContentProps } from './types';
import { ReadRoutineResponseDto } from '@/backend/routines/applications/dtos/RoutineDto';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { UI_MESSAGES } from '@/public/consts/routineItem';

const RoutineAccordionContentInner = ({
  challengeId,
  challengeName,
  contentRef,
}: RoutineAccordionContentProps) => {
  // 데이터 페칭
  const { data: routines = [], isLoading, error } = useGetRoutinesByChallenge(challengeId);
  const { data: completions = [], isLoading: completionsLoading } =
    useGetRoutineCompletionsByChallenge(challengeId);

  // 뮤테이션 훅들
  const createCompletionMutation = useCreateRoutineCompletion();
  const deleteCompletionMutation = useDeleteRoutineCompletion();

  // 모달 상태
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<ReadRoutineResponseDto | null>(null);

  const openModal = (routine: ReadRoutineResponseDto) => {
    setSelectedRoutine(routine);
    setIsCompletionModalOpen(true);
  };

  const closeModal = () => {
    setIsCompletionModalOpen(false);
    setSelectedRoutine(null);
  };

  // 루틴 완료 상태 확인 함수들
  const isRoutineCompleted = (routineId: number) => {
    return completions.some(completion => completion.routineId === routineId);
  };

  const getRoutineCompletion = (routineId: number) => {
    return completions.find(completion => completion.routineId === routineId);
  };

  // 이벤트 핸들러
  const handleRoutineCheck = (checked: boolean, routine: ReadRoutineResponseDto) => {
    if (checked) {
      openModal(routine);
    } else {
      const completion = getRoutineCompletion(routine.id);
      if (completion) {
        deleteCompletionMutation.mutate(completion.id);
      }
    }
  };

  // 루틴 완료 제출
  const handleCompletionSubmit = async (reviewText: string, photoFile?: File) => {
    if (!selectedRoutine) {
      alert('루틴을 선택해주세요.');
      return;
    }

    // TODO: 사진 파일이 있으면 먼저 업로드하고 URL 받아오기
    let proofImgUrl: string | null = null;
    if (photoFile) {
      // 임시로 파일명 사용 (실제 환경에서는 실제 URL로 대체해야 함)
      proofImgUrl = `uploaded_${Date.now()}_${photoFile.name}`;
    }

    createCompletionMutation.mutate(
      {
        userId: 'f1c6b5ae-b27e-4ae3-9e30-0cb8653b04fd', // TODO: 실제 사용자 ID 사용
        routineId: selectedRoutine.id,
        proofImgUrl,
      },
      {
        onSuccess: () => {
          closeModal();
          alert('루틴 완료가 제출되었습니다!');
        },
        onError: error => {
          console.error('루틴 완료 생성 오류:', error);
          alert('제출에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  // 인증샷 업로드 (기존 루틴에 사진 추가 시)
  const handlePhotoUpload = (routine: ReadRoutineResponseDto) => {
    // TODO: 기존 루틴에 사진만 추가하는 기능 구현
    console.log('사진 업로드 기능 구현 예정:', routine.routineTitle);
    alert('사진 업로드 기능은 추후 구현 예정입니다.');
  };

  const closeCompletionModal = () => {
    closeModal();
  };

  if (isLoading || completionsLoading) {
    return <RoutineListSkeleton />;
  }

  if (error) {
    return (
      <div className='p-4 text-center text-red-500'>
        <p className='mb-2'>{UI_MESSAGES.ERROR.LOAD_ROUTINES}</p>
        <p className='text-sm'>{error?.message || UI_MESSAGES.ERROR.UNKNOWN}</p>
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className='p-4 text-center text-gray-500'>
        <p className='mb-2'>등록된 루틴이 없습니다.</p>
        <p className='text-sm'>"{challengeName}" 챌린지에 루틴을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div ref={contentRef} className='border-t border-gray-200 bg-gray-50'>
      <div className='p-4'>
        <h4 className='text-lg font-semibold text-gray-800 mb-4'>📋 오늘의 루틴</h4>

        <div className='space-y-3'>
          {routines.map(routine => {
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

      {/* 루틴 완료 모달 (소감 + 사진) */}
      <RoutineCompletionModal
        isOpen={isCompletionModalOpen}
        selectedRoutine={selectedRoutine}
        onClose={closeCompletionModal}
        onSubmit={handleCompletionSubmit}
        loading={createCompletionMutation.isPending}
      />
    </div>
  );
};

// 에러 바운더리로 감싼 메인 컴포넌트
export const RoutineAccordionContent = (props: RoutineAccordionContentProps) => {
  return (
    <ErrorBoundary>
      <RoutineAccordionContentInner {...props} />
    </ErrorBoundary>
  );
};
