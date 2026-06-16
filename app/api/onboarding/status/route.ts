import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ done: false, redirectTo: null });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('온보딩 상태 조회 실패:', error);
    return NextResponse.json({ done: false, redirectTo: null });
  }

  const done = data?.onboarding_completed === true;
  return NextResponse.json({
    done,
    redirectTo: done ? '/user/dashboard' : null,
  });
}
