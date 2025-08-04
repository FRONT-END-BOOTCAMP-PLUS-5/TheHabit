export interface UserProfile {
  id: string;
  userId: string;
  nickname: string;
  bio?: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: 'ko' | 'en';
} 