import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      // 우리 시스템은 email을 고유 식별자로 사용.
      id: string;
      email: string;
      username: string;
      nickname: string;
      profileImg: string | null;
      profileImgPath: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    } & DefaultSession['user']; // 기존 name, image 등을 유지하기 위함
  }

  interface User extends DefaultUser {
    // 우리 시스템은 email을 고유 식별자로 사용.
    id?: string;
    email?: string;
    username?: string;
    nickname?: string;
    profileImg?: string | null;
    profileImgPath?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    // 우리 시스템은 email을 고유 식별자로 사용합니다.
    email?: string;
    username?: string;
    nickname?: string;
    profileImg?: string | null;
    profileImgPath?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    isNewUser?: boolean;
  }
}
