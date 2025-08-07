export class Challenge {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly created_at: Date,
    public readonly end_at: Date,
    public readonly startTime: Date | null,
    public readonly endTime: Date | null,
    public readonly color: string,
    public readonly userId: string,
    public readonly categoryId: number
  ) { }
}
