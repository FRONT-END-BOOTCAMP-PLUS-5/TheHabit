export interface IFcmTokenRepository {
  saveToken(userId: string, token: string): Promise<void>;
  clearToken(userId: string): Promise<void>;
  findTokenByUserId(userId: string): Promise<string | null>;
}
