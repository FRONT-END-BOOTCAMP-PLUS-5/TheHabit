import { FeedbackDto } from '@/backend/feedbacks/application/dtos/FeedbackDto';
import { axiosInstance } from '@/public/utils/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

export const FeedbackApi = async (
  feedBack: FeedbackDto,
  nickname: string
): Promise<ApiResponse<FeedbackDto>> => {
  try {
    const response = await axiosInstance.post(`/api/feedback/${encodeURIComponent(nickname)}`, {
      aiResponseContent: feedBack.aiResponseContent,
      challengeId: feedBack.challengeId,
    });

    return response.data;
  } catch (error) {
    console.error('피드백 생성 실패:', error);
    throw error;
  }
};

export const getFeedBackByChallengeId = async (
  challengeId: number,
  nickname: string
): Promise<ApiResponse<FeedbackDto>> => {
  try {
    const response = await axiosInstance.get(
      `/api/feedback/${encodeURIComponent(nickname)}/${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error('피드백 조회 실패:', error);
    throw error;
  }
};

export const getFeedBackByChallengeIdAndNickname = async (
  challengeId: number,
  nickname: string
): Promise<ApiResponse<FeedbackDto>> => {
  try {
    const response = await axiosInstance.get(
      `/api/feedback/${encodeURIComponent(nickname)}/${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error('피드백 조회(닉네임) 실패:', error);
    throw error;
  }
};
