import { SignUpRequestDto } from '@/backend/auths/application/dtos/SignUpRequestDto';
import { SignUpResponseDto } from '@/backend/auths/application/dtos/SignUpResponseDto';
import { IUserRepository } from '@/backend/users/domain/repositories/IUserRepository';
import bcrypt from 'bcryptjs';

export class CreateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) { }

  async signUp(signUpRequest: SignUpRequestDto): Promise<SignUpResponseDto> {
    try {
      const { email, password, username, nickname, profileImg, profileImgPath, profileFile } = signUpRequest;
      // 필수 입력란 검증
      if (!email || !password || !username || !nickname) {
        throw new Error("필수 입력값입니다.");
      }

      // 이메일 중복 확인
      const emailExists = await this.userRepository.checkEmailExists(email);
      if (emailExists) {
        throw new Error("이미 존재하는 이메일입니다.");
      }

      // 프로필 이미지 정보 설정
      let finalProfileImg = profileImg;
      let finalProfileImgPath = profileImgPath;

      // profileImage와 profileImagePath가 이미 설정되어 있으면 사용
      if (profileImg && profileImgPath) {
        finalProfileImg = profileImg;
        finalProfileImgPath = profileImgPath;
      } else if (profileFile) {
        try {
          const uploadResult = await this.userRepository.createProfileImg(profileFile);

          if (uploadResult && uploadResult.length >= 2) {
            finalProfileImg = uploadResult[0]; // S3 URL
            finalProfileImgPath = uploadResult[1]; // S3 Key
          }
        } catch (error) {
          throw error;
        }
      };

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);

      // 사용자 생성
      const user = await this.userRepository.create({
        email,
        password: hashedPassword,
        username,
        nickname,
        profileImg: finalProfileImg || null,
        profileImgPath: finalProfileImgPath || null,
      });

      // 성공 응답
      return {
        success: true,
        message: '회원가입이 성공적으로 완료되었습니다.',
        user: {
          id: user?.id ?? '',
          email: user?.email ?? '',
          username: user?.username ?? '',
          nickname: user?.nickname ?? '',
          profileImg: user?.profileImg ?? null,
          profileImgPath: user?.profileImgPath ?? null,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
