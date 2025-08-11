"use client";

import { FeedbackApi } from "@/libs/api/feedback.api";
import { useGetChallengeById } from "@/libs/hooks";
import { useGetGptResponse } from "@/libs/hooks/gpt-hooks/useGetGptResponse";
import { NextApiResponse } from "next";
import { useEffect, useState } from "react";

export const useCreateFeedback = () => {
  const [feedback, setFeedback] = useState<NextApiResponse>();
  const { data: challenge } = useGetChallengeById(28);
  const challengeName = challenge?.data?.name;
  const requestInput =
    challengeName &&
    `나는 일주일 동안 ${challengeName} 챌린지를 하고 있어, 이 챌린지에 대해서 피드백을 해줘 글자수는 10글자 이내로 작성해줘`;

  const { data: gptResponse } = useGetGptResponse({
    gptResponseContent: requestInput ?? "",
  });

  useEffect(() => {
    if (!gptResponse?.gptResponseContent) {
      return;
    }

    const fetchFeedback = async () => {
      const feedback = await FeedbackApi({
        gptResponseContent: gptResponse.gptResponseContent,
        challengeId: challenge?.data?.id ?? 0,
      });

      console.log(feedback);
      setFeedback(feedback);
    };

    fetchFeedback();
  }, [gptResponse?.gptResponseContent]);

  return feedback;
};
