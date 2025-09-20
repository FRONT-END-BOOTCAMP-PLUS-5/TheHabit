import { FeedbackApi, getFeedBackByChallengeId } from '@/libs/api/feedback.api';
import { RoutineCompletionDto } from '@/backend/routine-completions/application/dtos/RoutineCompletionDto';
import { ValidateFeedBackAiResponse } from '@/app/user/feedback/_components/ValidateFeedBacAiResponse';
import { AxiosError } from 'axios';
import { requestAI } from '@/libs/api/ai.api';

export const FeedBackPostData = async (
  challengeId: number,
  routineCompletion: RoutineCompletionDto[],
  nickname: string
) => {
  try {
    const validateChallenge = await getFeedBackByChallengeId(challengeId, nickname);

    // 기존 피드백이 있는지 더 확실하게 체크
    const existingFeedback = validateChallenge?.data?.aiResponseContent;
    if (existingFeedback && existingFeedback.trim() !== '') {
      return existingFeedback;
    }

    // 피드백이 없으면 새로 생성
    const routineStatusMessagesGPTResponse = await ValidateFeedBackAiResponse(
      challengeId,
      routineCompletion,
      nickname
    );

    if (!routineStatusMessagesGPTResponse || routineStatusMessagesGPTResponse.length === 0) {
      return;
    }

    const aiResponse = await requestAI({
      aiResponseContent: routineStatusMessagesGPTResponse.join('\n'),
    });

    if (!aiResponse.data?.aiResponseContent) {
      return [];
    }

    const feedBack = await FeedbackApi(
      {
        aiResponseContent: aiResponse.data.aiResponseContent,
        challengeId: challengeId,
      },
      nickname
    );

    return feedBack.data?.aiResponseContent || [];
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data.message;
    }
    return;
  }
};
