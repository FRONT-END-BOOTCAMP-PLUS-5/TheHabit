import { NextRequest, NextResponse } from 'next/server';
import { PrUserRepository } from '@/backend/users/infrastructure/repositories/PrUserRepository';
import { UpdateUserUsecase } from '@/backend/users/application/usecases/UpdateUserUsecase';
import { User } from '@/backend/users/domain/entities/UserEntity';
import { s3Service } from '@/backend/shared/services/s3.service';

const repository = new PrUserRepository();

const createUpdateUserUsecase = () => {
  return new UpdateUserUsecase(repository);
};

export async function POST(request: NextRequest): Promise<NextResponse | undefined> {
  try {
    const data = await request.formData();
    const id = data.get('id') as string;
    const userProfileImgPath = data.get('profile_img_path') as string;
    const userProfileImg = data.get('profile_img') as string;
    const username = data.get('username') as string;
    const nickname = data.get('nickname') as string;
    const beforeNickname = data.get('before_nickname') as string;
    const type = data.get('type') as string;
    const file = data.get('file') as File;

    let responseMessage;
    const image: {
      imageUrl: string;
      key: string;
    } = {
      imageUrl: '',
      key: '',
    };
    if (!id) throw new Error('사용자 아이디가 존재하지 않습니다!');
    if (!username) throw new Error('사용자 이름이 올바르지 않습니다!');
    if (!nickname) throw new Error('사용자 닉네임이 올바르지 않습니다!');

    if (type === 'update') await s3Service.deleteImage(userProfileImgPath);
    if (file) {
      const { imageUrl, key } = await s3Service.uploadImage(file, 'user');
      image.imageUrl = imageUrl;
      image.key = key;
    }

    const user = new User(
      username,
      nickname,
      image.imageUrl ? image.imageUrl : userProfileImg,
      image.key ? image.key : userProfileImgPath,
      id
    );

    const usecase = createUpdateUserUsecase();
    const updatedUserNickname = await usecase.execute(user, beforeNickname);

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
