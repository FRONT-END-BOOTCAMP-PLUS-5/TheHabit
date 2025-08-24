import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData, // InfiniteData를 import 합니다.
} from '@tanstack/react-query';
import { getUserRoutineCompletion } from '@/libs/api/routines.api';
import { CreateRoutineCompletionResponseDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';

interface IUserCompletions {
  data: CreateRoutineCompletionResponseDto[];
  nextPage: number | null;
}

const PAGE_SIZE = 9;

const fetchUserCompletions = async ({
  pageParam = 1,
  nickname,
  category,
}: {
  pageParam?: number;
  nickname: string;
  category: string;
}): Promise<IUserCompletions> => {
  const response = await getUserRoutineCompletion(
    nickname,
    pageParam as number,
    PAGE_SIZE,
    category
  );

  const hasNextPage = response?.data && response.data.length === PAGE_SIZE;
  const nextPage = hasNextPage ? (pageParam as number) + 1 : null;

  return {
    data: response?.data || [],
    nextPage,
  };
};


export const useGetUserCompletion = (
  nickname: string,
  category: string,
  userId: string
): UseInfiniteQueryResult<InfiniteData<IUserCompletions>, Error> => {
  const isEnabled = userId !== 'edit';

  return useInfiniteQuery<IUserCompletions, Error>({
    queryKey: ['userCompletions', nickname, category],
    queryFn: ({ pageParam = 1 }) =>
      fetchUserCompletions({ pageParam: pageParam as number, nickname, category }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
    enabled: isEnabled,
  });
};
