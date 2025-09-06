import UserProfileSection from '@/app/(anon)/_components/UserProfileSection';
import ChallengeListSection from '@/app/(anon)/_components/ChallengeList';
import React from 'react';

const MainPage: React.FC = () => {
  return (
    <>
      <UserProfileSection />
      <ChallengeListSection />
    </>
  );
};

export default MainPage;
