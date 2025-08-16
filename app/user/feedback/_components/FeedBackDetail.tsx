'use client';

import React from 'react';
import { useGetAllChallenges } from '@/libs/hooks/challenges-hooks/useGetAllChallenges';
import Link from 'next/link';
import { useGetAllRoutines } from '@/libs/hooks/routines-hooks';

const FeedBackDetail = () => {
  const { data: UserChallengeData } = useGetAllChallenges();
  const { data: UserRoutineData } = useGetAllRoutines();

  const userChallenges = UserChallengeData?.filter(
    challenge => challenge.userId === 'f1c6b5ae-b27e-4ae3-9e30-0cb8653b04fd'
  );

  const userRoutineData = UserRoutineData?.data?.filter(item => {
    return userChallenges?.some(challenge => challenge.id === item.challengeId);
  });

  console.log(userRoutineData);

  return (
    <div>
      {userChallenges && userChallenges.length > 0 ? (
        userChallenges.map(challenge => (
          <div key={challenge.id}>
            <Link key={challenge.id} href={`/user/feedback/${challenge.id}`}>
              {challenge.name}
            </Link>
          </div>
        ))
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default FeedBackDetail;
