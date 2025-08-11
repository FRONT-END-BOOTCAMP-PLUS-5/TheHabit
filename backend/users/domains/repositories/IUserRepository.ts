import { User } from "@/backend/users/domains/entities/UserEntity";

export interface IUserRepository {
  // Create
  create(user: User): Promise<User | undefined>;

  // Read
  findById(id: string): Promise<User | null | undefined>;
  findAll(): Promise<User[] | undefined>;

  // Update
  updateUserNickname(id: string, nickname: string): Promise<User | undefined>;
  updateUserName(id: string, username: string): Promise<User | undefined>;

  // Delete
  delete(id: string): Promise<boolean | undefined>;
}

