export interface Routine {
  id: number;
  routineTitle: string;
  alertTime: Date | null;
  emoji: number;
  challengeId: number;
  createdAt: Date;
  updatedAt: Date;
}