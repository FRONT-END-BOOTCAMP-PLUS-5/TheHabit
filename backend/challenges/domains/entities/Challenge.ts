export class Challenge {
  constructor(
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly endAt: Date,
    public readonly color: string,
    public readonly userId: string,
    public readonly categoryId: number,
    public readonly active: boolean,
    public readonly id?: number
  ) { }
}
