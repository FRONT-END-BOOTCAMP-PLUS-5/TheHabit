export class PushSubscription {
  constructor(
    public readonly id: number,
    public readonly endpoint: string,
    public readonly p256dh: string,
    public readonly auth: string,
    public readonly userId: string | null,
    public readonly createdAt: Date
  ) {}
}