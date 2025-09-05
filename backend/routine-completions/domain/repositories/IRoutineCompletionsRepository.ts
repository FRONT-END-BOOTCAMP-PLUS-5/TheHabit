import { RoutineCompletion } from '@/backend/routine-completions/domain/entities/routineCompletion';

export interface IRoutineCompletionsRepository {
  // 루틴 완료 생성
  create(
    routineCompletion: Omit<RoutineCompletion, 'id' | 'createdAt'>
  ): Promise<RoutineCompletion>;

  // 이미지 업로드
  uploadImage(file: File): Promise<{ imageUrl: string; key: string }>;

  // 닉네임으로 루틴 완료 생성
  createByNickname(request: {
    nickname: string;
    routineId: number;
    content: string;
    proofImgUrl: string | null;
  }): Promise<RoutineCompletion>;

  // 루틴 완료 조회
  findByRoutineId(routineId: number): Promise<RoutineCompletion[]>;
  findByNickname(nickname: string): Promise<RoutineCompletion[]>;
  findById(completionId: number): Promise<RoutineCompletion | null>;
  findByNicknameAndRoutineId(nickname: string, routineId: number): Promise<RoutineCompletion[]>;

  // 루틴 완료 수정 (인증샷 업데이트)
  update(
    completionId: number,
    routineCompletion: Partial<RoutineCompletion>
  ): Promise<RoutineCompletion>;

  // 루틴 완료 삭제
  delete(completionId: number): Promise<boolean>;
}
