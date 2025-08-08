export interface AddChallengeRequestDto {
  readonly id: number;
  readonly name: string;
  readonly createdAt: string;
  readonly endAt: string;
  readonly startTime: string | null;
  readonly endTime: string | null;
  readonly color: string;
  readonly categoryId: number;
}

