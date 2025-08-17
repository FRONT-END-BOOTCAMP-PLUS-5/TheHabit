import { NextRequest, NextResponse } from 'next/server';
import { CreateUserReviewUsecase } from '@/backend/users/applications/usecases/CreateUserReviewUsecase';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { GetUserReviewUsecase } from '@/backend/users/applications/usecases/GetUserReviewUsecase';
import { DeleteReviewEmotionByUserUsecase } from '@/backend/users/applications/usecases/DeleteReviewByUserUsecase';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';
import { UserReviewDto } from '@/backend/users/applications/dtos/UserReviewDto';

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

type UserReviews = ApiResponse<UserReviewDto[]>;
type UserReview = ApiResponse<UserReviewDto>;

export async function GET(request: NextRequest): Promise<NextResponse<UserReviews> | undefined> {
  try {
    const routineCompletionId = request.nextUrl.searchParams.get('routineCompletionId');
    const formatRoutineCompletionId = Number(routineCompletionId);

    if (!routineCompletionId) throw new Error('루틴을 완료한 아이디 값이 없습니다!');

    const usecase = createGetUserReview();
    const userRoutineCompletionReview = await usecase.execute(formatRoutineCompletionId);

    const processedReviews = userRoutineCompletionReview.map(review => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: processedReviews,
        message: 'success',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.message || 'GET_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<UserReview> | undefined> {
  try {
    const { explain: reviewContent, routineCompletionId, userId } = await request.json();
    const formatRoutineCompletionId = Number(routineCompletionId);

    if (!reviewContent) {
      throw new Error('잘못된 리뷰 아이콘입니다!');
    }

    const usecase = createReviewByUserNickname();
    const review = await usecase.execute(reviewContent, formatRoutineCompletionId, userId!);

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'REVIEW_CREATION_FAILED',
            message: '유저 감정표현 생성 실패',
          },
        },
        { status: 500 }
      );
    }

    const processedReview = {
      ...review,
      createdAt: review.createdAt.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: processedReview,
        message: 'success',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.message || 'POST_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
    }
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
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.message || 'DELETE_FAILED',
            message: 'fail',
          },
        },
        { status: 500 }
      );
  }
}
