'use client';
import { Suspense } from 'react';
import { FollowPageContent } from '@/app/user/follow/components/FollowPageContent';

const FollowPage = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FollowPageContent />
    </Suspense>
  );
};

export default FollowPage;
