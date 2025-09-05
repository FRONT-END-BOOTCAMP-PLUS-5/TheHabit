import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/public/utils/prismaClient';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { AddFeedbackDto } from '@/backend/feedbacks/application/dtos/AddfeedbackDto';
import { FeedBackEntity } from '@/backend/feedbacks/domain/entities/FeedBackEntity';
import { PrFeedBackRepository } from '@/backend/feedbacks/infrastructure/repositories/PrFeedBackRepository';
import { AddFeedBackUsecase } from '@/backend/feedbacks/application/usecases/AddFeedBackUsecase';

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) => {
  const { nickname } = await params;
  const body = await request.json();

  if (!body.gptResponseContent || !body.challengeId || !nickname) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'gptResponseContent, challengeId 또는 nickname이 없습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    // 소유권 확인: 해당 nickname의 사용자 챌린지인지 검증
    const challenge = await prisma.challenge.findFirst({
      where: { id: Number(body.challengeId), user: { nickname } },
      select: { id: true },
    });

    if (!challenge) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: { code: 'FORBIDDEN', message: '해당 사용자 챌린지가 아닙니다.' },
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    const feedbackRepo = new PrFeedBackRepository();
    const feedBackUseCase = new AddFeedBackUsecase(feedbackRepo);

    const entity = new FeedBackEntity(
      String(body.gptResponseContent).split('\n'),
      Number(body.challengeId)
    );

    const result = await feedBackUseCase.execute(entity);

    const successResponse: ApiResponse<AddFeedbackDto> = {
      success: true,
      data: {
        challengeId: result.challengeId,
        gptResponseContent: result.gptResponseContent.join('\n'),
      },
      message: '피드백 데이터 저장에 성공했습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(error.message, { status: 500 });
    }

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '피드백 데이터 저장에 실패했습니다.',
      },
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
};
