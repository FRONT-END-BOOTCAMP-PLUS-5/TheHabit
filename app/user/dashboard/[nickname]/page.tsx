import React from 'react';
import UserProfileSection from '@/app/_components/user-profile-section/UserProfileSection';
import ChallengeListSection from '@/app/user/dashboard/_components/ChallengeListSection';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { redirect } from 'next/navigation';

const MainPage: React.FC = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', session?.user?.id)
    .single();

  if (!data?.onboarding_completed) {
    redirect('/onboarding');
  }

  return (
    <main className='px-2 py-2'>
      <UserProfileSection />
      <ChallengeListSection />
    </main>
  );
};

export default MainPage;
