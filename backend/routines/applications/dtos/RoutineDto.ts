export interface CreateRoutineRequestDto {
  routineTitle: string;
  alertTime: Date | null;
  emoji: number;
  challengeId: number;
}

export interface ReadRoutineResponseDto {
  id: number;
  routineTitle: string;
  alertTime: string | null;
  emoji: number;
  challengeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRoutineRequestDto {
  routineId: number;
  routineTitle?: string;
  alertTime?: Date | null;
  emoji?: number;
}

// 메인페이지 READ용 루틴 DTO (Application Service에서 사용)
export interface DashboardRoutineDto {
  id: number;
  routineTitle: string;
  alertTime: string | null;
  emoji: number;
  challengeId: number;
  createdAt: string;
  updatedAt: string;
  isCompletedToday: boolean;
}
