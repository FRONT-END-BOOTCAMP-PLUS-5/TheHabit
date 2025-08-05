export class User {
  constructor(
    public readonly username: string,
    public readonly nickname: string,
    public readonly profileImg: string | null,
    public readonly id?: string,
    public readonly password?: string,
    public readonly email?: string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
  ) { }
}
