import { SignUpRequestDto } from '@/backend/auths/applications/dtos/SignUpRequestDto';
import { SignUpResponseDto } from '@/backend/auths/applications/dtos/SignUpResponseDto';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import bcrypt from 'bcryptjs';

export class CreateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

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

            console.log('🖼️ [CreateUserUsecase] 프로필 이미지 정보:', { 
                profileImg, 
                profileImgPath, 
                hasProfileFile: !!profileFile 
            });

            // profileImage와 profileImagePath가 이미 설정되어 있으면 사용
            if (profileImg && profileImgPath) {
                finalProfileImg = profileImg;
                finalProfileImgPath = profileImgPath;
                console.log('✅ [CreateUserUsecase] 폼에서 설정된 프로필 이미지 사용:', { finalProfileImg, finalProfileImgPath });
            } else if (profileFile) {
                console.log('🔄 [CreateUserUsecase] S3 업로드 시작:', profileFile.name);
                try {
                    const uploadResult = await this.userRepository.createProfileImg(profileFile);
                    console.log('📤 [CreateUserUsecase] S3 업로드 결과:', uploadResult);
                    
                    if (uploadResult && uploadResult.length >= 2) {
                        finalProfileImg = uploadResult[0]; // S3 URL
                        finalProfileImgPath = uploadResult[1]; // S3 Key
                        console.log('✅ [CreateUserUsecase] S3 업로드 성공:', { finalProfileImg, finalProfileImgPath });
                    } else {
                        console.log('❌ [CreateUserUsecase] S3 업로드 실패: uploadResult가 올바르지 않음');
                    }
                } catch (error) {
                    console.error('💥 [CreateUserUsecase] S3 업로드 중 에러 발생:', error);
                }
            } else {
                console.log('ℹ️ [CreateUserUsecase] 프로필 이미지 없음');
            }

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
