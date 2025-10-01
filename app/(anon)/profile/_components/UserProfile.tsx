'use client';

import React from 'react';
import UserProfileSection from '@/app/(anon)/_components/UserProfileSection';
import { UserProfileButton } from '@/app/(anon)/profile/_components/UserProfileButton';
import { LoginCta } from '@/app/(anon)/_components/LoginCta';
import { RoutineCompletion } from '@/app/(anon)/profile/_components/RoutineCompletion';

export const UserProfile: React.FC = () => {
  return (
    <div className='px-2 py-2 w-full flex flex-col'>
      <UserProfileSection />
      <UserProfileButton />
      <RoutineCompletion />
      <div className='mt-5 flex flex-col gap-5 w-full items-center justify-center text-center p-5'>
        <p className='text-center text-2xl font-bold'>아직 등록된 챌린지가 없어요</p>
        <p className='text-center text-gray-500'>새 챌린지를 만들어 오늘부터 시작해보세요.</p>
      </div>
      <LoginCta />
    </div>
  );
};
