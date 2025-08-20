import { User } from '@/backend/users/domains/entities/UserEntity';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';

export interface KakaoUserInfo {
  id: string; // 카카오 고유 ID (참고용, 실제 검색에는 사용하지 않음)
  email?: string; // 이메일 (사용자 식별에 사용)
  nickname?: string; // 카카오 닉네임
  profile_image?: string; // 프로필 이미지 URL
  profile_nickname_needs_agreement?: boolean; // 닉네임 동의 여부
  email_needs_agreement?: boolean; // 이메일 동의 여부
}

export interface KakaoLoginResult {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    nickname: string;
    profileImg?: string | null;
    profileImgPath?: string | null;
  };
  isNewUser?: boolean;
}

export class KakaoLoginUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(kakaoUserInfo: KakaoUserInfo): Promise<KakaoLoginResult> {
    try {
      // 이메일이 없는 경우 처리
      if (!kakaoUserInfo.email) {
        return {
          success: false,
          message:
            '카카오 계정에서 이메일 정보를 제공받을 수 없습니다. 이메일 제공에 동의해주세요.',
        };
      }

      // 1. 이메일로 기존 회원 찾기
      const existingUser = await this.findUserByEmail(kakaoUserInfo.email);

      if (existingUser) {
        // 기존 회원인 경우 로그인 처리
        return this.handleExistingUser(existingUser);
      } else {
        // 신규 회원인 경우 회원 생성 및 저장
        return await this.handleNewUser(kakaoUserInfo);
      }
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '카카오 로그인 처리 중 오류가 발생했습니다.',
      };
    }
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      // 사용자를 찾을 수 없는 경우 null 반환 (신규 회원)
      if (error instanceof Error && error.message.includes('사용자를 찾을 수 없습니다')) {
        return null;
      }
      console.error('이메일로 사용자 검색 중 오류:', error);
      return null;
    }
  }

  private handleExistingUser(user: User): KakaoLoginResult {
    return {
      success: true,
      message: '기존 회원 로그인 성공',
      user: {
        id: user.id || '',
        email: user.email || '',
        username: user.username,
        nickname: user.nickname,
        profileImg: user.profileImg,
        profileImgPath: user.profileImgPath,
      },
      isNewUser: false,
    };
  }

  private async handleNewUser(kakaoUserInfo: KakaoUserInfo): Promise<KakaoLoginResult> {
    try {
      // 2. 신규 회원 생성
      const newUser = this.createNewUser(kakaoUserInfo);

      // 3. 회원 저장
      const savedUser = await this.saveUser(newUser);

      if (!savedUser) {
        throw new Error('새로운 사용자 저장에 실패했습니다.');
      }

      return {
        success: true,
        message: '신규 회원 가입 및 로그인 성공',
        user: {
          id: savedUser.id || '',
          email: savedUser.email || '',
          username: savedUser.username,
          nickname: savedUser.nickname,
          profileImg: savedUser.profileImg,
          profileImgPath: savedUser.profileImgPath,
        },
        isNewUser: true,
      };
    } catch (error) {
      throw new Error(
        `신규 회원 처리 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }

  private createNewUser(kakaoUserInfo: KakaoUserInfo): User {
    // 카카오에서 제공하는 정보를 사용하여 사용자 생성
    const username = kakaoUserInfo.nickname || `카카오사용자_${kakaoUserInfo.id}`;
    const nickname = this.generateNickname(username);
    const profileImg = kakaoUserInfo.profile_image || null;
    const email = kakaoUserInfo.email!; // 이메일은 이미 확인됨

    return new User(
      username,
      nickname,
      profileImg,
      null, // profileImgPath는 null로 설정
      undefined, // id는 저장 후 생성됨
      undefined, // password는 소셜 로그인이므로 불필요
      email
    );
  }

  private generateNickname(name: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${name}_${timestamp}_${randomStr}`;
  }

  private async saveUser(user: User): Promise<User | null> {
    try {
      const savedUser = await this.userRepository.create(user);
      return savedUser;
    } catch (error) {
      console.error('사용자 저장 중 오류:', error);
      throw new Error('사용자 저장에 실패했습니다.');
    }
  }
}
