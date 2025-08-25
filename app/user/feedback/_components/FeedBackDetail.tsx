'use client';

import CategoryChallengeList from '@/app/user/dashboard/_components/CategoryChallengeList';
import ConfirmModal from '@/app/_components/modals/ConfirmModal';
import { useGetDashboardByNickname } from '@/libs/hooks/dashboard-hooks/useGetDashboardByNickname';
import { useGenerateFeedback } from '@/libs/hooks/feedback-hooks/useGenerateFeedback';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const FeedBackDetail: React.FC<{ nickname: string }> = ({ nickname }) => {
  const { data, isLoading } = useGetDashboardByNickname(nickname || '');
  const router = useRouter();
  console.log(isLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);

  const generateFeedback = useGenerateFeedback();
  const routineCompletion = data?.routineCompletions.map(routineCompletion => {
    return {
      ...routineCompletion,
      routineId: routineCompletion.routineId,
      createdAt: routineCompletion.createdAt.toString(),
      proofImgUrl: routineCompletion.proofImgUrl,
      nickname: nickname,
    };
  });

  const handleClick = (challengeId: number) => {
    setSelectedChallengeId(challengeId);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (isSubmitting || selectedChallengeId === null) return;
    setIsSubmitting(true);
    try {
      await generateFeedback.mutateAsync({
        challengeId: selectedChallengeId,
        routineCompletions: routineCompletion || [],
        nickname: nickname || '',
      });
      router.push(`/user/feedback/${nickname}/${selectedChallengeId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      setSelectedChallengeId(null);
    }
  };

  return (
    <div className='w-10/11 mx-auto mt-10'>
      <CategoryChallengeList
        onFeedbackClick={handleClick}
        dashboard={
          data || {
            challenge: [],
            routines: [],
            routineCompletions: [],
          }
        }
        challenges={data?.challenge || []}
        routines={data?.routines || []}
        routineCompletions={routineCompletion || []}
      />
      <ConfirmModal
        type='positive'
        title='피드백 생성'
        description='챌린지의 진행 상황으로 피드백을 받을까요?'
        isOpen={isConfirmOpen}
        confirmDisabled={isSubmitting}
        onClose={() => {
          if (isSubmitting) return;
          setIsConfirmOpen(false);
          setSelectedChallengeId(null);
        }}
        onConfirm={handleConfirm}
      >
        <div className='text-sm text-gray-600'>확인을 누르면 피드백을 생성합니다.</div>
      </ConfirmModal>
    </div>
  );
};
