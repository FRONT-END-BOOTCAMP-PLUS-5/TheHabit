import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/public/utils/prismaClient';
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
    const feedback = await prisma.feedback.findFirst({
      where: {
        challengeId: Number(id),
        challenge: {
          user: { nickname },
        },
      },
      select: { gptResponseContent: true, challengeId: true },
    });

    const successResponse: ApiResponse<FeedbackDto> = {
      success: true,
      data: {
        aiResponseContent: feedback?.gptResponseContent ?? '',
        challengeId: feedback?.challengeId ?? Number(id),
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
