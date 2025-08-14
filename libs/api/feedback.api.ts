import { FeedBackEntity } from '@/backend/feedbacks/domains/entities/FeedBackEntity';
import { axiosInstance } from '@/public/utils/axiosInstance';

export const FeedbackApi = async (feedBack: FeedBackEntity): Promise<FeedBackEntity> => {
  const response = await axiosInstance.post('/api/feedback', {
    gptResponseContent: feedBack.gptResponseContent,
    challengeId: feedBack.challengeId,
  });

  return response.data;
};

export const getFeedBackById = async (id: number): Promise<FeedBackEntity> => {
  const response = await axiosInstance.get(`/api/feedback/${id}`);
  return response.data.result;
};
