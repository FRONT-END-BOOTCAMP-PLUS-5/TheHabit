import { AddFeedbackDto } from '@/backend/feedbacks/applications/dtos/AddfeedbackDto';
import { GetFeedBackUsecase } from '@/backend/feedbacks/applications/usecases/GetFeedBackUseacse';
import { PrFeedBackRepository } from '@/backend/feedbacks/infrastructures/repositories/PrFeedBackRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (_req: NextRequest, context: { params: Promise<{ id: number }> }) => {
  const { id } = await context.params;

  try {
    const feedBackRepo = new PrFeedBackRepository();
    const feedBackUseCase = new GetFeedBackUsecase(feedBackRepo);
    const result = await feedBackUseCase.execute(Number(id));

    const successResponse: ApiResponse<{ feedback: AddFeedbackDto[] }> = {
      success: true,
      data: {
        feedback: [result],
      },
      message: '피드백 조회에 성공했습니다.',
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
        message: '피드백 조회에 실패했습니다.',
      },
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
};
