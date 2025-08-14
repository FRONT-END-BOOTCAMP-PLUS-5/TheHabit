'use client';

import React from 'react';
import { useGetAllChallenges } from '@/libs/hooks/challenges-hooks/useGetAllChallenges';
import Link from 'next/link';

const FeedBackDetail = () => {
  const { data } = useGetAllChallenges();

  return (
    <div>
      {data && data.length > 0 ? (
        data.map(challenge => (
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
