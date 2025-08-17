import { AddFeedbackDto } from '@/backend/feedbacks/applications/dtos/AddfeedbackDto';
import { AddFeedBackUsecase } from '@/backend/feedbacks/applications/usecases/AddFeedBackUsecase';
import { PrFeedBackRepository } from '@/backend/feedbacks/infrastructures/repositories/PrFeedBackRepository';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  if (!body.gptResponseContent || !body.challengeId) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'gptResponseContent 또는 challengeId가 없습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    const feedbackRepo = new PrFeedBackRepository();
    const feedBackUseCase = new AddFeedBackUsecase(feedbackRepo);
    const result = await feedBackUseCase.execute(body);

    if (!result) {
      const errorResponse: ApiResponse<AddFeedbackDto> = {
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: '피드백 데이터 저장에 실패했습니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const successResponse: ApiResponse<AddFeedbackDto> = {
      success: true,
      data: result,
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
