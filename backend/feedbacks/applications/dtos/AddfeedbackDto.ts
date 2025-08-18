export interface AddFeedbackDto {
  readonly gptResponseContent: string[];
  readonly challengeId: number;
  readonly id?: number;
}
