import { NextRequest, NextResponse } from 'next/server';
import { CreateUserReviewUsecase } from '@/backend/users/applications/usecases/CreateUserReviewUsecase';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { GetUserReviewUsecase } from '@/backend/users/applications/usecases/GetUserReviewUsecase';
import { DeleteReviewEmotionByUserUsecase } from '@/backend/users/applications/usecases/DeleteReviewByUserUsecase';

const repository = new PrUserRepository();

const createGetUserReview = () => {
  return new GetUserReviewUsecase(repository);
};

const createReviewByUserNickname = () => {
  return new CreateUserReviewUsecase(repository);
};

const createDeleteReviewEmotionByUser = () => {
  return new DeleteReviewEmotionByUserUsecase(repository);
};

export async function GET(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const routineCompletionId = request.nextUrl.searchParams.get('routineCompletionId');
    const formatRoutineCompletionId = Number(routineCompletionId);

    if (!routineCompletionId) throw new Error('루틴을 완료한 아이디 값이 없습니다!');

    const usecase = createGetUserReview();
    const userRoutineCompletionReview = await usecase.execute(formatRoutineCompletionId);

    return NextResponse.json(
      {
        success: true,
        data: userRoutineCompletionReview,
        message: 'success',
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: err.message || 'GET_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const { explain: reviewContent, routineCompletionId, userId } = await request.json();
    const formatRoutineCompletionId = Number(routineCompletionId);

    if (!reviewContent) throw new Error('잘못된 리뷰 아이콘입니다!');

    const usecase = createReviewByUserNickname();
    const review = await usecase.execute(reviewContent, formatRoutineCompletionId, userId!);

    return NextResponse.json(
      {
        success: true,
        data: review,
        message: 'success',
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: err.message || 'POST_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const { id, routineCompletionId, reviewContent } = await request.json();
    const formatRoutineCompletionId = Number(routineCompletionId);

    if (!id) throw new Error('사용자 아이디가 존재하지 않습니다!');

    const usecase = createDeleteReviewEmotionByUser();
    const deletedReviewEmotion = await usecase.execute(
      reviewContent,
      formatRoutineCompletionId,
      id
    );

    return NextResponse.json(
      {
        success: true,
        data: deletedReviewEmotion,
        message: 'success',
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: err.message || 'DELETE_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}
