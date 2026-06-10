import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { FeedbackDto } from '@/backend/feedbacks/application/dtos/FeedbackDto';

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ nickname: string; id: string }> }
) => {
  const { nickname, id } = await params;

  if (!nickname || !id) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: { code: 'INVALID_REQUEST', message: 'nickname 또는 id가 없습니다.' },
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const challengeId = Number(id);

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .maybeSingle();

    if (!user) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: { code: 'NOT_FOUND', message: '사용자를 찾을 수 없습니다.' },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const { data: challenge } = await supabase
      .from('challenges')
      .select('id')
      .eq('id', challengeId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!challenge) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: { code: 'FORBIDDEN', message: '해당 사용자 챌린지가 아닙니다.' },
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    const { data: feedback } = await supabase
      .from('challenge_feedbacks')
      .select('gpt_response_content, challenge_id')
      .eq('challenge_id', challengeId)
      .maybeSingle();

    const successResponse: ApiResponse<FeedbackDto> = {
      success: true,
      data: {
        aiResponseContent: feedback?.gpt_response_content ?? '',
        challengeId: feedback?.challenge_id ?? challengeId,
      },
      message: '피드백 조회에 성공했습니다.',
    };

    return NextResponse.json(successResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '피드백 조회에 실패했습니다.';
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};
