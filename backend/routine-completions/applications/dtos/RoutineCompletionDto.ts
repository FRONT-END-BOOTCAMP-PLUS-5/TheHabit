import { RoutineCompletion } from '@/backend/routine-completions/domains/entities/routine-completion/routineCompletion';

export interface CreateRoutineCompletionRequestDto {
  userId: string;
  routineId: number;
  review: string;
  proofImgUrl: string | null;
}

export interface CreateRoutineCompletionResponseDto {
  id: number;
  userId: string;
  routineId: number;
  createdAt: Date;
  proofImgUrl: string | null;
  content: string | null;
}

// 루틴 완료 목록 조회
export interface ReadRoutineCompletionListDto {
  completions: RoutineCompletionDto[];
  total: number;
  page: number;
  limit: number;
}
// 메인 페이지 - 오늘의 루틴 완료 상태
export interface CreateTodayRoutineCompletionDto {
  routineId: number;
  isCompleted: boolean;
  completion?: RoutineCompletionDto;
}

// 루틴 완료 수정 (인증샷 업데이트)
export interface UpdateRoutineCompletionDto {
  proofImgUrl: string | null;
}

// 루틴 완료 DTO - 기본
export interface RoutineCompletionDto {
  id: number;
  routineId: number;
  createdAt: string;
  proofImgUrl: string | null;
}

// DTO Mapper

export class RoutineCompletionDtoMapper {
  static fromEntity(entity: RoutineCompletion): RoutineCompletionDto {
    return {
      id: entity.id,
      routineId: entity.routineId,
      createdAt: entity.createdAt.toISOString(),
      proofImgUrl: entity.proofImgUrl,
    };
  }

  static fromEntities(entities: RoutineCompletion[]): RoutineCompletionDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
