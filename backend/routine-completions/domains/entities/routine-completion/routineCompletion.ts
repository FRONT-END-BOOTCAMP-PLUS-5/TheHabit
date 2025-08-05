export class RoutineCompletion {
  constructor(
    public readonly id: number,
    public readonly userId: string,
    public readonly routineId: number,
    public readonly createdAt: Date,
    public readonly proofImgUrl: string | null
  );
}
