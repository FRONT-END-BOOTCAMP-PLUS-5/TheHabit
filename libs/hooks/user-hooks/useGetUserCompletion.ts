import {
    useInfiniteQuery,
    UseInfiniteQueryResult,
    InfiniteData, // InfiniteData를 import 합니다.
} from '@tanstack/react-query';
import { usersApi } from '@/libs/api/users.api';
import {CreateRoutineCompletionResponseDto} from "@/backend/routine-completions/applications/dtos/RoutineCompletionDto";

interface IUserCompletions {
    data: CreateRoutineCompletionResponseDto[];
    nextPage: number | null;
}

const PAGE_SIZE = 9;

const fetchUserCompletions = async ({ pageParam = 1, nickname }: { pageParam?: number; nickname: string }): Promise<IUserCompletions> => {
    const { getUserRoutineCompletion } = usersApi;

    const response = await getUserRoutineCompletion(nickname, pageParam as number, PAGE_SIZE);

    const hasNextPage = response?.data && response.data.length === PAGE_SIZE;
    const nextPage = hasNextPage ? (pageParam as number) + 1 : null;

    return {
        data: response?.data || [],
        nextPage,
    };
};

/**
 * infinite scroll을 위한 사용자 루틴 완료 커스텀 훅
 * @param nickname 사용자 닉네임
 * @return UseInfiniteQueryResult<InfiniteData<IUserCompletions>, Error> 타입 반환
 */
export const useGetUserCompletion = (nickname: string): UseInfiniteQueryResult<InfiniteData<IUserCompletions>, Error> => {
    return useInfiniteQuery<IUserCompletions, Error>({
        queryKey: ['userCompletions', nickname],
        queryFn: ({ pageParam = 1 }) => fetchUserCompletions({ pageParam: pageParam as number, nickname }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });
};