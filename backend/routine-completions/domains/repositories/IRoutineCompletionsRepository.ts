import { RoutineCompletion } from '../entities/routine-completion/routineCompletion';

export interface IRoutineCompletionsRepository {
  // 루틴 완료 생성
  create(
    routineCompletion: Omit<RoutineCompletion, 'id' | 'createdAt'>
  ): Promise<RoutineCompletion>;

  // 루틴 완료 조회
  findByRoutineId(routineId: number): Promise<RoutineCompletion[]>;
  findByUserId(userId: string): Promise<RoutineCompletion[]>;
  findById(completionId: number): Promise<RoutineCompletion | null>;
  findByUserIdAndRoutineId(userId: string, routineId: number): Promise<RoutineCompletion[]>;

  // 루틴 완료 수정 (인증샷 업데이트)
  update(
    completionId: number,
    routineCompletion: Partial<RoutineCompletion>
  ): Promise<RoutineCompletion>;

  // 루틴 완료 삭제
  delete(completionId: number): Promise<boolean>;

  // 이미지 업로드
  uploadImage(file: File): Promise<{ imageUrl: string; key: string }>;
}
