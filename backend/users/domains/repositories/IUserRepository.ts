import { User } from "@/backend/users/domains/entities/UserEntity";

export interface IUserRepository {
  // Create
  create(user: User): Promise<User | undefined>;
  createProfileImg(file: File): Promise<string[] | undefined>;

  // Read
  findById(id: string): Promise<User | null | undefined>;
  findAll(): Promise<User[] | undefined>;

  // Update
  updateUserNickname(id: string, nickname: string): Promise<User | {message: string} | undefined>;
  updateUserName(id: string, username: string): Promise<User | undefined>;
  updateProfileImg(id: string, userProfilePath: string, file:File, type:'create' | 'update'): Promise<User | undefined>;


  // Delete
  delete(id: string): Promise<boolean | undefined>;
  deleteProfileImg(key: string): Promise<boolean | undefined>;
}

