export interface AddChallengeRequestDto {
  readonly id: number;
  readonly name: string;
  readonly created_at: string;
  readonly end_at: string;
  readonly startTime: string | null;
  readonly endTime: string | null;
  readonly color: string;
  readonly categoryId: number;
}

