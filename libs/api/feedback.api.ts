import { AddFeedbackDto } from '@/backend/feedbacks/application/dtos/AddfeedbackDto';
import { axiosInstance } from '@/public/utils/axiosInstance';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

export const FeedbackApi = async (
  feedBack: AddFeedbackDto,
  nickname: string
): Promise<ApiResponse<AddFeedbackDto>> => {
  try {
    const response = await axiosInstance.post(`/api/feedback/${encodeURIComponent(nickname)}`, {
      gptResponseContent: feedBack.gptResponseContent,
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
): Promise<ApiResponse<AddFeedbackDto>> => {
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
): Promise<ApiResponse<AddFeedbackDto>> => {
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
