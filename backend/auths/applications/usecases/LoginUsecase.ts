import { LoginRequestDto } from '@/backend/auths/applications/dtos/LoginRequestDto';
import { LoginResponseDto } from '@/backend/auths/applications/dtos/LoginResponseDto';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { Rex } from '@/public/consts/Rex';
import bcrypt from 'bcryptjs';

export class LoginUsecase {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      if (!loginRequest.email || !loginRequest.password) {
        return {
          success: false,
          message: '이메일과 비밀번호를 모두 입력해주세요.',
        };
      }

      const isEmailValid = Rex.email.standard.test(loginRequest.email);

      if (!isEmailValid) {
        // console.log("❌ [LoginUsecase] 이메일 형식 검증 실패:", loginRequest.email);
        return {
          success: false,
          message: "올바른 이메일 형식을 입력해주세요."
        };
      }
      // console.log("✅ [LoginUsecase] 이메일 형식 검증 통과:", loginRequest.email);

      const user = await this.userRepository.findByEmail(loginRequest.email);

      if (!user?.id) {
        return {
          success: false,
          message: '사용자 ID가 유효하지 않습니다.',
        };
      }

      const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password || '');

      if (!isPasswordValid) {
        // console.log("❌ [LoginUsecase] 비밀번호 검증 실패: 비밀번호 불일치");
        return {
          success: false,
          message: '비밀번호가 일치하지 않습니다.',
        };
      }

      // 로그인 성공 응답 생성

      const successResponse = {
        success: true,
        message: '로그인 성공',
        user: {
          id: user.id,
          email: user.email || '',
          username: user.username,
          nickname: user.nickname,
          profileImg: user.profileImg,
          profileImgPath: user.profileImgPath,
        },
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