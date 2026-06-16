import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { OnBoardingStepComponent } from '@/app/onboarding/_components/OnBoardingStep';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

const OnBoardingPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .maybeSingle();

    if (data?.onboarding_completed) {
      redirect('/user/dashboard');
    }
  }

  return (
    <main className='flex flex-col items-center justify-between min-h-screen bg-white px-6 py-8'>
      <OnBoardingStepComponent />
    </main>
  );
};

export default OnBoardingPage;
