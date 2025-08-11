import { FeedBackEntity } from "@/backend/feedbacks/domains/entities/FeedBackEntity";
import { axiosInstance } from "@/public/utils/axiosInstance";
import { NextApiResponse } from "next";

export const FeedbackApi = async (
  feedBack: FeedBackEntity
): Promise<NextApiResponse> => {
  const response = await axiosInstance.post("/api/feedback", {
    gptResponseContent: feedBack.gptResponseContent,
    challengeId: feedBack.challengeId,
  });

  return response.data;
};
