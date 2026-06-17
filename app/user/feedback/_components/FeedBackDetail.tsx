'use client';

import CategoryChallengeList from '@/app/user/dashboard/_components/CategoryChallengeList';
import ConfirmModal from '@/app/_components/modals/ConfirmModal';
import { LoadingSpinner } from '@/app/_components/loading/LoadingSpinner';
import { Toast } from '@/app/_components/toasts/Toast';
import { useGetDashboardByNickname } from '@/libs/hooks/dashboard-hooks/useGetDashboardByNickname';
import { useGenerateFeedback } from '@/libs/hooks/feedback-hooks/useGenerateFeedback';
import { useNavigationBlocker } from '@/libs/hooks/useNavigationBlocker';
import { useUserPage } from '@/libs/hooks/user-hooks/useUserPage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const FeedBackDetail: React.FC<{
  nickname: string;
  onSubmittingChange?: (isSubmitting: boolean) => void;
}> = ({ nickname, onSubmittingChange }) => {
  const { data } = useGetDashboardByNickname(nickname || '');
  const { isOwnProfile } = useUserPage(nickname);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);

  useNavigationBlocker(isSubmitting);

  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

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
    setIsConfirmOpen(false);
    setIsSubmitting(true);

    try {
      await generateFeedback.mutateAsync({
        challengeId: selectedChallengeId,
        routineCompletions: routineCompletion || [],
        nickname: nickname || '',
      });
      router.push(`/user/feedback/${nickname}/${selectedChallengeId}`);
    } catch {
      Toast.error('피드백 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      setSelectedChallengeId(null);
    }
  };

  return (
    <div className='w-10/11 mx-auto mt-10'>
      <CategoryChallengeList
        nickname={nickname}
        isOwner={isOwnProfile}
        onFeedbackClick={isOwnProfile ? handleClick : undefined}
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
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedChallengeId(null);
        }}
        onConfirm={handleConfirm}
      >
        <div className='text-sm text-gray-600'>확인을 누르면 피드백을 생성합니다.</div>
      </ConfirmModal>

      {isSubmitting && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]'>
          <LoadingSpinner size='large' />
        </div>
      )}
    </div>
  );
};
