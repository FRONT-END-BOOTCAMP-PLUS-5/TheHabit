export class FeedBackEntity {
  constructor(
    public readonly gptResponseContent: string,
    public readonly challengeId: number
  ) {}
}
