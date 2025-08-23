'use client';

import { useGetDashboardByNickname } from '@/libs/hooks';
import React, { useState } from 'react';
import { FeedBackPostData } from '@/app/user/feedback/_components/FeedBackPostData';
import { useRouter } from 'next/navigation';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';
import CategoryChallengeList from '@/app/user/dashboard/_components/CategoryChallengeList';
import ConfirmModal from '@/app/_components/modals/ConfirmModal';

export const FeedBackDetail = () => {
  const { userInfo } = useGetUserInfo();
  const nickname = userInfo?.nickname;
  const { data } = useGetDashboardByNickname('aiden0413');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);

  const routineCompletion = data?.routineCompletions.map(routineCompletion => {
    return {
      ...routineCompletion,
      routineId: routineCompletion.routineId,
      createdAt: routineCompletion.createdAt.toString(),
      proofImgUrl: routineCompletion.proofImgUrl,
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
      await FeedBackPostData(selectedChallengeId, routineCompletion || [], nickname || '');
      router.push(`/user/feedback/${selectedChallengeId}`);
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
