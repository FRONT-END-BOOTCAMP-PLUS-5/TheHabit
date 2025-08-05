export interface CreateRoutineRequestDto {
  routineTitle: string;
  alertTime: Date | null;
  emoji: number;
  challengeId: number;
}

export interface ReadRoutineResponseDto {
  id: number;
  routineTitle: string;
  alertTime: Date | null;
  emoji: number;
  challengeId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateRoutineRequestDto {
  routineId: number;
  routineTitle?: string;
  alertTime?: Date | null;
  emoji?: number;
}

export interface UpdateRoutineResponseDto {
  id: number;
  routineTitle: string;
  alertTime: Date | null;
  emoji: number;
  challengeId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteRoutineRequestDto {
  routineId: number;
}

export interface DeleteRoutineResponseDto {
  success: boolean;
  message: string;
}

// 메인페이지 READ용 루틴 DTO (Application Service에서 사용)
export interface DashboardRoutineDto {
  id: number;
  routineTitle: string;
  alertTime: Date | null;
  emoji: number;
  challengeId: number;
  createdAt: Date;
  updatedAt: Date;
  emojiData?: EmojiDto;
  isCompletedToday: boolean;
}

export interface EmojiDto {
  id: number;
  name: string;
  unicode: string;
  category: string;
}
