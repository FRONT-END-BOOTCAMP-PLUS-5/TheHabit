import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChallenge } from "@/libs/api/challenges.api";
import { AddChallengeRequestDto } from "@/backend/challenges/applications/dtos/AddChallengeDto";
import { ChallengeDto } from "@/backend/challenges/applications/dtos/ChallengeDto";

/**
 * 챌린지를 생성하는 훅
 * @returns 챌린지 생성 mutation
 */
export const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      success: boolean;
      data?: ChallengeDto;
      message?: string;
      error?: { code: string; message: string };
    },
    Error,
    AddChallengeRequestDto
  >({
    mutationFn: createChallenge,
    onSuccess: (data) => {
      // 챌린지 생성 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["challenges", "all"] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "category"] });

      console.log("챌린지 생성 성공:", data);
    },
    onError: (error) => {
      console.error("챌린지 생성 실패:", error);
    },
  });
};
