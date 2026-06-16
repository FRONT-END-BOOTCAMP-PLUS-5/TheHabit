import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('users')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (error) {
      console.error('온보딩 완료 DB 저장 실패:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }
  }

  const redirectTo = session?.user ? '/user/dashboard' : '/demo';
  return NextResponse.json({ success: true, redirectTo });
}
