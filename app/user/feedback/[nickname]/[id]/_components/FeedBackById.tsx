'use client';

import { FeedBackDetailSkeleton } from '@/app/user/feedback/_components/FeedBackSkeleton';
import { useGetDashboardByNickname } from '@/libs/hooks';
import { useGetFeedBackById } from '@/libs/hooks/feedback-hooks/useGetFeedBackById';
import { CATEGORY_CONFIG } from '@/public/consts/categoryConfig';
import React from 'react';

export const FeedBackById = ({ id, nickname }: { id: number; nickname: string }) => {
  const enabled = !!nickname;
  const { data: feedBackData } = useGetFeedBackById(id, nickname);
  const { data: dashboardData, isLoading } = useGetDashboardByNickname(enabled ? nickname : '');

  const challenge = dashboardData?.challenge?.find(ch => ch.id === Number(id));

  return (
    <>
      {isLoading ? (
        <FeedBackDetailSkeleton />
      ) : (
        <div className='flex flex-col w-10/11 mx-auto gap-6'>
          <span className='w-fit mt-10 border text-center font-semibold rounded-full px-2 py-1'>
            {CATEGORY_CONFIG.find(category => category.id === challenge?.categoryId)?.name}
          </span>
          <span className='text-3xl font-bold'>{challenge?.name}</span>
          {feedBackData?.data?.gptResponseContent ? (
            <span className='text-md text-gray-600 mt-4'>
              {feedBackData?.data?.gptResponseContent}
            </span>
          ) : (
            <span className='text-md text-gray-600 mt-4'>
              루틴을 생성해주세요! 피드백을 받을 수 있어요.
            </span>
          )}
        </div>
      )}
    </>
  );
};
