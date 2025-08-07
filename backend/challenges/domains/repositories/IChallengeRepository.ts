import { Challenge } from '../entities/ChallengeEntity';

export interface IChallengeRepository {
  // Create
  create(challenge: Challenge): Promise<Challenge>;

  // Read
  findById(id: number): Promise<Challenge | null>;
  findByUserId(userId: string): Promise<Challenge[]>;
  findByCategoryId(categoryId: number): Promise<Challenge[]>;
  findAll(): Promise<Challenge[]>;
  // findAll()은 잠정적으로 보류

  // Update
  update(id: number, challenge: Partial<Challenge>): Promise<Challenge | null>;

  // Delete
  delete(id: number): Promise<boolean>;
  deleteByUserId(userId: string): Promise<boolean>;
}
