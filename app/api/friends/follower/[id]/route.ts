import { NextRequest, NextResponse } from 'next/server';
import { PrFollowRepository } from '@/backend/follows/infrastructure/repositories/PrFollowRepository';
import { GetFollowerByToUserIdUsecase } from '@/backend/follows/application/usecases/GetFollowerByToUserIdUsecase';

const repository = new PrFollowRepository();

const createGetFollowerByToUserIdUsecase = () => {
  return new GetFollowerByToUserIdUsecase(repository);
};

export async function GET(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const toUserId = request.nextUrl.searchParams.get('toUserId');
    const keyword = request.nextUrl.searchParams.get('keyword');

    if (!toUserId) throw new Error('사용자 아이디가 존재하지 않습니다!');

    const usecase = createGetFollowerByToUserIdUsecase();
    const followers = await usecase.execute(toUserId, keyword || '');

    return NextResponse.json(
      {
        success: true,
        data: followers,
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
