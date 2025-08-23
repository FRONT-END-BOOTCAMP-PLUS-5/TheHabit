'use client';

import { PrevButton } from '@/app/_components/buttons/PrevButton';
import { useGetDashboardByNickname } from '@/libs/hooks';
import { useGetFeedBackById } from '@/libs/hooks/feedback-hooks/useGetFeedBackById';
import { CATEGORY_CONFIG } from '@/public/consts/categoryConfig';
import React from 'react';

export const FeedBackById = ({ id }: { id: number }) => {
  const { data: feedBackData } = useGetFeedBackById(id);
  const { data: dashboardData } = useGetDashboardByNickname('aiden0413');

  // id가 일치하는 단일 챌린지 찾기 (map → find로 수정)
  const challenge = dashboardData?.challenge?.find(ch => ch.id === Number(id));

  // 디버그용: 비교값 확인
  // console.log({ routeId: id, challengeFound: challenge?.id });
  return (
    <div className='flex flex-col w-10/11 mx-auto gap-6'>
      <PrevButton className='mb-5' />
      <span className='w-1/5 border text-center font-semibold rounded-full px-2 py-1'>
        {CATEGORY_CONFIG.find(category => category.id === challenge?.categoryId)?.name}
      </span>
      <span className='text-3xl font-bold'>{challenge?.name}</span>
      <span className='text-md text-gray-600 mt-4'>{feedBackData?.data?.gptResponseContent}</span>
    </div>
  );
};
