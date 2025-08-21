'use client';

import { useGetDashboardByNickname } from '@/libs/hooks';
import React from 'react';
import { FeedBackPostData } from '@/app/user/feedback/_components/FeedBackPostData';
import { useRouter } from 'next/navigation';
import { useGetUserInfo } from '@/libs/hooks/user-hooks/useGetUserInfo';

export const FeedBackDetail = () => {
  const { userInfo } = useGetUserInfo();
  const nickname = userInfo?.nickname;
  const { data } = useGetDashboardByNickname(nickname || '');
  const router = useRouter();

  //이제 챌린지를 돌면서 그에 맞는 루린틀 가져오기
  const challenge = data?.challenge.map(challenge => {
    const routine = data?.routines.filter(routine => routine.challengeId === challenge.id);
    return {
      ...challenge,
      routine: routine,
    };
  });

  const routineCompletion = data?.routineCompletions.map(routineCompletion => {
    return {
      ...routineCompletion,
      routineId: routineCompletion.routineId,
      createdAt: routineCompletion.createdAt.toString(),
      proofImgUrl: routineCompletion.proofImgUrl,
    };
  });
  const handleClick = async (challengeId: number) => {
    await FeedBackPostData(challengeId, routineCompletion || [], nickname || '');
    router.push(`/user/feedback/${challengeId}`);
  };

  return (
    <div>
      {challenge?.map(challenge => (
        <div key={challenge.id}>
          <h1
            className='text-2xl font-bold cursor-pointer'
            onClick={() => handleClick(challenge.id ?? 0)}
          >
            {challenge.name}
          </h1>
          {challenge.routine?.map(routine => (
            <div key={routine.id}>
              <h2>{routine.routineTitle}</h2>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
