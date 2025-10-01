import { User } from '@/backend/users/domain/entities/UserEntity';
import { IUserRepository } from '@/backend/users/domain/repositories/IUserRepository';
import { LoginResponseDto } from '@/backend/auths/application/dtos/LoginResponseDto';

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
}


export class GoogleLoginUsecase {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(googleUserInfo: GoogleUserInfo): Promise<LoginResponseDto> {
    try {
      // 1. 이메일로 기존 회원 찾기
      const existingUser = await this.findUserByEmail(googleUserInfo.email);

      if (existingUser) {
        return this.handleExistingUser(existingUser);
      } else {
        // 신규 회원인 경우 회원 생성 및 저장
        return await this.handleNewUser(googleUserInfo);
      }
    } catch (error) {
      console.error('구글 로그인 처리 중 오류가 발생했습니다:', error);
      throw new Error('구글 로그인 처리 중 오류가 발생했습니다.');
    }
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      // 이메일로 사용자 검색 (UserRepository에 findByEmail 메서드가 있다고 가정)
      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      console.error('이메일로 사용자 검색 중 오류가 발생했습니다:', error);
      return null;
    }
  }

  private handleExistingUser(user: User): LoginResponseDto {
    return {
      id: user.id || '',
      email: user.email || '',
      nickname: user.nickname,
      name: user.username,
      profileImg: user.profileImg || '',
    };
  }

  private async handleNewUser(googleUserInfo: GoogleUserInfo): Promise<LoginResponseDto> {
    try {
      // 2. 신규 회원 생성
      const newUser = this.createNewUser(googleUserInfo);

      // 3. 회원 저장
      const savedUser = await this.saveUser(newUser);

      if (!savedUser) {
        throw new Error('새로운 사용자 저장에 실패했습니다.');
      }

      return {
        id: savedUser.id || '',
        email: savedUser.email || '',
        nickname: savedUser.nickname,
        name: savedUser.username,
        profileImg: savedUser.profileImg || '',
      };
    } catch (error) {
      throw new Error(`신규 회원 처리 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  private createNewUser(googleUserInfo: GoogleUserInfo): User {
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
      console.error('사용자 저장에 실패했습니다:', error);
      throw new Error('사용자 저장에 실패했습니다.');
    }
  }
}
