export class ChallengeEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly startTime: Date | null,
    public readonly endTime: Date | null,
    public readonly color: string,
    public readonly userId: string,
    public readonly categoryId: number
  ) { }
}
