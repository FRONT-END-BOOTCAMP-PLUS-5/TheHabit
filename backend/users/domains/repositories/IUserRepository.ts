import { User } from '@/backend/users/domains/entities/UserEntity';

export interface IUserRepository {
  // Create
  create(user: User): Promise<User>;
  createProfileImg(file: File): Promise<string[] | undefined>;

  // Read
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>; // username으로 조회 추가
  findByEmail(email: string): Promise<User | null>;
  checkEmailExists(email: string): Promise<boolean>;

  // Update
  update(id: string, user: Partial<User>): Promise<User | null>;
  updateUserNickname(id: string, nickname: string): Promise<User | { message: string } | undefined>;
  updateUserName(id: string, username: string): Promise<User | undefined>;
  updateProfileImg(
    id: string,
    userProfilePath: string,
    file: File,
    type: 'create' | 'update'
  ): Promise<User | undefined>;

  // Delete
  delete(id: string): Promise<boolean>;
  deleteProfileImg(key: string): Promise<boolean | undefined>;
}
