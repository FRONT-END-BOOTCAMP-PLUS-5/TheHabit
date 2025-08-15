export interface DashboardDto {
  challenge: ChallengeDto | null;
  routines: RoutineDto[];
  routineCount: number;
}

export interface ChallengeDto {
  id: number;
  name: string;
  createdAt: Date;
  endAt: Date;
  startTime: Date | null;
  endTime: Date | null;
  color: string;
  categoryId: number;
  categoryName?: string; // 카테고리 이름도 포함
}

export interface RoutineDto {
  id: number;
  routineTitle: string;
  alertTime: Date | null;
  emoji: number;
  createdAt: Date;
  updatedAt: Date;
  completions?: RoutineCompletionDto[]; // 루틴 완료 정보도 포함
}

export interface RoutineCompletionDto {
  id: number;
  createdAt: Date;
  proofImgUrl: string | null;
  content: string | null;
}
