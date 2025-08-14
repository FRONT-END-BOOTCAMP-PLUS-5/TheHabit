export class Routine {
  constructor(
    public readonly id: number,
    public readonly routineTitle: string,
    public readonly alertTime: Date | null,
    public readonly emoji: number,
    public readonly challengeId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
