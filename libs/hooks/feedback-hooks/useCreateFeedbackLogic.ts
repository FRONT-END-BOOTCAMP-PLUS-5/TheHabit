"use client";

import { FeedbackApi } from "@/libs/api/feedback.api";
import { useGetChallengeById } from "@/libs/hooks";
import { useGetGptResponse } from "@/libs/hooks/gpt-hooks/useGetGptResponse";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useGetFeedBackById } from "@/libs/hooks/feedback-hooks/useGetFeedBackById";

export const useCreateFeedbackLogic = (id: number) => {
  const { data: challenge } = useGetChallengeById(id);
  const { data: feedBack } = useGetFeedBackById(id);

  const hasExistingFeedback = !!feedBack?.gptResponseContent;

  const challengeName = challenge?.data?.name;
  const requestInput =
    challengeName && !hasExistingFeedback
      ? `나는 일주일 동안 ${challengeName} 챌린지를 하고 있어, 이 챌린지에 대해서 피드백을 해줘 글자수는 10글자 이내로 작성해줘`
      : "";

  const { data: gptResponse } = useGetGptResponse({
    gptResponseContent: requestInput || "",
  });

  const mutation = useMutation({
    mutationFn: FeedbackApi,
  });

  useEffect(() => {
    if (hasExistingFeedback) return;
    const content = gptResponse?.gptResponseContent;
    const challengeId = challenge?.data?.id;
    if (!content || !challengeId) return;

    mutation.mutate({
      gptResponseContent: content,
      challengeId,
    });
  }, [
    hasExistingFeedback,
    gptResponse?.gptResponseContent,
    challenge?.data?.id,
  ]);

  const finalGptContent =
    feedBack?.gptResponseContent || gptResponse?.gptResponseContent;

  return { challenge, gptResponse: finalGptContent };
};
