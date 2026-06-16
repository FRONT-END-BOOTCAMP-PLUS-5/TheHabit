import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('온보딩 상태 조회 실패:', error);
    redirect('/onboarding');
  }

  if (!data?.onboarding_completed) {
    redirect('/onboarding');
  }

  return redirect(`/user/dashboard/${encodeURIComponent(session?.user?.nickname)}`);
}
