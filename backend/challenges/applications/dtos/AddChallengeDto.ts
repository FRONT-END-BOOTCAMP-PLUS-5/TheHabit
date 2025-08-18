export interface AddChallengeRequestDto {
  readonly name: string;
  readonly createdAt: string;
  readonly endAt: string;
  readonly color: string;
  readonly categoryId: number;
  readonly active: boolean;
  readonly nickname: string;
}
