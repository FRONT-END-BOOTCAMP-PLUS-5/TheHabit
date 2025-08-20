import { NextRequest, NextResponse } from 'next/server';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { UpdateUserNicknameUsecase } from '@/backend/users/applications/usecases/UpdateUserNicknameUsecase';

const repository = new PrUserRepository();

const createUpdateUserNicknameUsecase = () => {
  return new UpdateUserNicknameUsecase(repository);
};

export async function POST(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const { id, nickname } = await request.json();
    let responseMessage;
    if (!id) throw new Error('사용자 아이디가 존재하지 않습니다!');
    if (!nickname) throw new Error('사용자 닉네임이 올바르지 않습니다!');

    const usecase = createUpdateUserNicknameUsecase();
    const updatedUserNickname = await usecase.execute(id, nickname);

    if ('message' in updatedUserNickname!) {
      responseMessage = updatedUserNickname.message;
    } else {
      return NextResponse.json(
        {
          success: true,
          data: updatedUserNickname,
          message: 'success',
        },
        { status: 201 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        data: updatedUserNickname,
        message: responseMessage || 'success',
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
