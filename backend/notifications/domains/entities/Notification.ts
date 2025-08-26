export class Notification {
  constructor(
    public readonly type: string,
    public readonly title: string,
    public readonly message: string,
    public readonly userId: string,
    public readonly isRead: boolean = false,
    public readonly fromUserId?: string | null,
    public readonly metadata?: any,
    public readonly id?: number,
    public readonly createdAt?: Date
  ) {}
}