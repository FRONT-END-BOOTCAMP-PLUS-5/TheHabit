import React from 'react';
import UserProfileSection from '@/app/_components/user-profile-section/UserProfileSection';
import ChallengeListSection from '@/app/user/dashboard/_components/ChallengeListSection';

interface MainPageProps {
  params: Promise<{ nickname: string }>;
}

const MainPage: React.FC<MainPageProps> = async () => {

  return (
    <main className='px-2 py-2'>
      <UserProfileSection />
      <ChallengeListSection />
    </main>
  );
};

export default MainPage;
