export class FeedBackEntity {
  constructor(
    public readonly gptResponseContent: string[],
    public readonly challengeId: number,
    public readonly id?: number
  ) {}
}
