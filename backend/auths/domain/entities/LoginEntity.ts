export class LoginEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly accessToken?: string,
    public readonly refreshToken?: string,
    public readonly expiresAt?: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
