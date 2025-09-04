import { LoginRequestDto } from '@/backend/auths/applications/dtos/LoginRequestDto';
import { LoginResponseDto } from '@/backend/auths/applications/dtos/LoginResponseDto';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { Rex } from '@/public/consts/Rex';
import bcrypt from 'bcryptjs';

export class LoginUsecase {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(loginRequest: LoginRequestDto): Promise<LoginResponseDto | null> {
    try {
      if (!loginRequest.email || !loginRequest.password) {
        return null;
      }

      const isEmailValid = Rex.email.standard.test(loginRequest.email);

      if (!isEmailValid) 
        return null;
      

      const user = await this.userRepository.findByEmail(loginRequest.email);
      if (!user?.id) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password || '');
      console.log('isPasswordValid', isPasswordValid);
      if (!isPasswordValid) {
        return null;
      }

      // 로그인 성공 응답 생성

      const successResponse = {
        id: user.id,
        nickname: user.nickname,
        name: user.username,
        email: user.email || '',
        profileImg: user.profileImg || '',
      };
      return successResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('로그인 처리 중 알 수 없는 오류가 발생했습니다.');
    }
  }
}