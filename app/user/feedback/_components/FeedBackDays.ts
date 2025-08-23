import { getDateString } from '@/public/utils/dateUtils';

export const getChallengeDays = (days: number, challengeCreatedAt: string): string[] => {
  const startDate = new Date(challengeCreatedAt);

  const dateArray = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return getDateString(date);
  });

  return dateArray;
};
