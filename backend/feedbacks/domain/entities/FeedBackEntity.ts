export class FeedBackEntity {
  constructor(
    public readonly aiResponseContent: string[],
    public readonly challengeId: number,
    public readonly id?: number
  ) {}
}
