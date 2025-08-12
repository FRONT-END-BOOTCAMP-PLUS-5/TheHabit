import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import { getChallengeById } from '@/libs/api/challenges.api';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import {CreateRoutineCompletionResponseDto} from "@/backend/routine-completions/applications/dtos/RoutineCompletionDto";

/**
 * infinite scroll 구현
 * @param nickname
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 * @return 챌린지 상세 조회 결과
 */
export const useGetUserCompletion = (nickname: string, enabled: boolean = true) => {
    return useInfiniteQuery

};