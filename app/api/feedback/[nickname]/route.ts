import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { FeedbackDto } from '@/backend/feedbacks/application/dtos/FeedbackDto';
import { FeedBackEntity } from '@/backend/feedbacks/domain/entities/FeedBackEntity';
import { PrFeedBackRepository } from '@/backend/feedbacks/infrastructure/repositories/PrFeedBackRepository';
import { AddFeedBackUsecase } from '@/backend/feedbacks/application/usecases/AddFeedBackUsecase';

async function verifyChallengeOwnership(nickname: string, challengeId: number): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle();

  if (!user) return false;

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id')
    .eq('id', challengeId)
    .eq('user_id', user.id)
    .maybeSingle();

  return !!challenge;
}

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) => {
  const { nickname } = await params;
  const body = await request.json();

  const aiResponseContent: unknown = body.aiResponseContent ?? body.aiResponse;
  const challengeIdNumber = Number(body.challengeId);

  if (
    typeof aiResponseContent !== 'string' ||
    aiResponseContent.trim().length === 0 ||
    Number.isNaN(challengeIdNumber) ||
    !nickname
  ) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'aiResponseContent, challengeId 또는 nickname이 없습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    const isOwner = await verifyChallengeOwnership(nickname, challengeIdNumber);

    if (!isOwner) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: { code: 'FORBIDDEN', message: '해당 사용자 챌린지가 아닙니다.' },
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    const feedbackRepo = new PrFeedBackRepository();
    const feedBackUseCase = new AddFeedBackUsecase(feedbackRepo);

    const entity = new FeedBackEntity(String(aiResponseContent).split('\n'), challengeIdNumber);

    const result = await feedBackUseCase.execute(entity);

    const successResponse: ApiResponse<FeedbackDto> = {
      success: true,
      data: {
        challengeId: result.challengeId,
        aiResponseContent: result.aiResponseContent.join('\n'),
      },
      message: '피드백 데이터 저장에 성공했습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '피드백 데이터 저장에 실패했습니다.';
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};
