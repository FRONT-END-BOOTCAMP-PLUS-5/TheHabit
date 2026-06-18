export interface SaveFcmTokenRequestDto {
  userId: string;
  token: string;
}

export interface FcmTokenDto {
  userId: string;
  token: string;
  updatedAt: string;
}
