import { NextRequest, NextResponse } from 'next/server';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { UpdateUserNameUsecase } from '@/backend/users/applications/usecases/UpdateUserNameUsecase';

const repository = new PrUserRepository();

const createUpdateUserNameUsecase = () => {
  return new UpdateUserNameUsecase(repository);
};

export async function POST(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const { id, username } = await request.json();
    if (!id) throw new Error('사용자 아이디가 존재하지 않습니다!');
    if (!username) throw new Error('사용자 이름이 올바르지 않습니다!');

    const usecase = createUpdateUserNameUsecase();
    const updatedUserName = await usecase.execute(id, username);

    return NextResponse.json(
      {
        success: true,
        data: updatedUserName,
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
