import { User } from '@/backend/users/domains/entities/UserEntity';
import { IUserRepository } from '../../../users/domains/repositories/IUserRepository';

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

export interface GoogleLoginResult {
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

export class GoogleLoginUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(googleUserInfo: GoogleUserInfo): Promise<GoogleLoginResult> {
    try {
      // 1. 이메일로 기존 회원 찾기
      const existingUser = await this.findUserByEmail(googleUserInfo.email);
      
      if (existingUser) {
        // 기존 회원인 경우 로그인 처리
        return this.handleExistingUser(existingUser);
      } else {
        // 신규 회원인 경우 회원 생성 및 저장
        return await this.handleNewUser(googleUserInfo);
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '구글 로그인 처리 중 오류가 발생했습니다.'
      };
    }
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      // 이메일로 사용자 검색 (UserRepository에 findByEmail 메서드가 있다고 가정)
      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      console.error('이메일로 사용자 검색 중 오류:', error);
      return null;
    }
  }

  private handleExistingUser(user: User): GoogleLoginResult {
    return {
      success: true,
      message: '기존 회원 로그인 성공',
      user: {
        id: user.id || '',
        email: user.email || '',
        username: user.username,
        nickname: user.nickname,
        profileImg: user.profileImg,
        profileImgPath: user.profileImgPath
      },
      isNewUser: false
    };
  }

  private async handleNewUser(googleUserInfo: GoogleUserInfo): Promise<GoogleLoginResult> {
    try {
      // 2. 신규 회원 생성
      const newUser = this.createNewUser(googleUserInfo);
      
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
          profileImgPath: savedUser.profileImgPath
        },
        isNewUser: true
      };
    } catch (error) {
      throw new Error(`신규 회원 처리 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  private createNewUser(googleUserInfo: GoogleUserInfo): User {
    // 구글 정보를 바탕으로 새로운 User 엔티티 생성
    const username = googleUserInfo.name;
    const nickname = this.generateNickname(googleUserInfo.name);
    const profileImg = googleUserInfo.picture || null;
    const email = googleUserInfo.email;

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

  private async generateNickname(name: string): Promise<string> {
  let nickname = `${name}_${Date.now().toString().slice(-6)}`;
  let counter = 1;
  
  // 닉네임 중복 검사 및 재생성
  while (await this.isNicknameExists(nickname)) {
    nickname = `${name}_${Date.now().toString().slice(-6)}_${counter}`;
    counter++;
    
    // 무한 루프 방지
    if (counter > 100) {
      nickname = `${name}_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substr(2, 5)}`;
      break;
    }
  }
  
  return nickname;
}

private async isNicknameExists(nickname: string): Promise<boolean> {
  try {
    const existingUser = await this.userRepository.findByNickname(nickname);
    return existingUser !== null;
  } catch (error) {
    console.error('닉네임 중복 검사 중 오류:', error);
    return false; // 에러 발생 시 중복이 아닌 것으로 처리
  }
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
