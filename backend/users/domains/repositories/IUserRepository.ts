import { User } from "@/backend/users/domains/entities/UserEntity";
import {RoutineCompletion} from "@prisma/client";

export interface IUserRepository {
  // Create
  create(user: User): Promise<User | undefined>;
  createProfileImg(file: File): Promise<string[] | undefined>;

  // Read
  findById(id: string): Promise<User | null | undefined>;
  findAll(): Promise<User[] | undefined>;
  findByEmail(email: string): Promise<User | null | undefined>;
  findByUserNicknameRoutineCompletion(nickname: string, page: number, pageSize: number, categoryId: string): Promise<RoutineCompletion[] | undefined>

  findByEmail(email: string): Promise<User>;
  checkEmailExists(email: string): Promise<boolean>;


  // Update
  updateUserNickname(id: string, nickname: string): Promise<User | { message: string } | undefined>;
  updateUserName(id: string, username: string): Promise<User | undefined>;
  updateProfileImg(
    id: string,
    userProfilePath: string,
    file: File,
    type: 'create' | 'update'
  ): Promise<User | undefined>;

  // Delete
  delete(id: string): Promise<boolean | undefined>;
  deleteProfileImg(key: string): Promise<boolean | undefined>;
}

