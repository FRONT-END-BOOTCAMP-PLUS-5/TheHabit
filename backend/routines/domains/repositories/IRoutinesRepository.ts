import { Routine } from '../entities/routine/routine';
export interface IRoutinesRepository {
  // 루틴 생성
  create(routine: Omit<Routine, 'id' | 'createdAt'>): Promise<Routine>;
  // 루틴 조회
  findByChallengeId(challengeId: number): Promise<Routine[]>;
  findByUserId(userId: string): Promise<Routine[]>;
  findById(routineId: number): Promise<Routine | null>;
  findAll(): Promise<Routine[]>;
  // 루틴 수정
  update(routineId: number, routine: Partial<Routine>): Promise<Routine>;
  // 루틴 삭제
  delete(routineId: number): Promise<boolean>;
}
