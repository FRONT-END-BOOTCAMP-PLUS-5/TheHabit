export class Challenge {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly endAt: Date,
    public readonly startTime: Date | null,
    public readonly endTime: Date | null,
    public readonly color: string,
    public readonly userId: string,
    public readonly categoryId: number
  ) { }
}
