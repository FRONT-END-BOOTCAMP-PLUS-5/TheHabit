import { RoutineCompletion } from '@/backend/routine-completions/domains/entities/routineCompletion';

export interface CreateRoutineCompletionRequestDto {
  nickname: string;
  routineId: number;
  content: string;
  proofImgUrl: string | null;
}

export interface CreateRoutineCompletionResponseDto {
  id: number;
  routineId: number;
  createdAt: Date;
  proofImgUrl: string | null;
  content: string | null;
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
  content: string | null;
}

// DTO Mapper

export class RoutineCompletionDtoMapper {
  static fromEntity(entity: RoutineCompletion): RoutineCompletionDto {
    return {
      id: entity.id,
      routineId: entity.routineId,
      createdAt: entity.createdAt.toISOString(),
      proofImgUrl: entity.proofImgUrl,
      content: entity.content,
    };
  }

  static fromEntities(entities: RoutineCompletion[]): RoutineCompletionDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
