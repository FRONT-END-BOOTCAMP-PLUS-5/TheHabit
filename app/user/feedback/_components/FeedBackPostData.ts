import { FeedbackApi, getFeedBackByChallengeId } from '@/libs/api/feedback.api';
import { requestGPT } from '@/libs/api/gpt.api';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { ValidateFeedBackGPTResponse } from '@/app/user/feedback/_components/ValidateFeedBackGPTResponse';

export const FeedBackPostData = async (
  challengeId: number,
  routineCompletion: RoutineCompletionDto[],
  nickname: string
) => {
  try {
    const validateChallenge = await getFeedBackByChallengeId(challengeId, nickname);

    // 기존 피드백이 있는지 더 확실하게 체크
    const existingFeedback = validateChallenge?.data?.gptResponseContent;
    if (existingFeedback && existingFeedback.trim() !== '') {
      return existingFeedback;
    }

    // 피드백이 없으면 새로 생성
    const routineStatusMessagesGPTResponse = await ValidateFeedBackGPTResponse(
      challengeId,
      routineCompletion,
      nickname
    );

    if (!routineStatusMessagesGPTResponse || routineStatusMessagesGPTResponse.length === 0) {
      return;
    }

    const gptResponse = await requestGPT({
      gptResponseContent: routineStatusMessagesGPTResponse.join('\n'),
    });

    if (!gptResponse.data?.gptResponseContent) {
      return [];
    }

    const feedBack = await FeedbackApi(
      {
        gptResponseContent: gptResponse.data.gptResponseContent,
        challengeId: challengeId,
      },
      nickname
    );

    return feedBack.data?.gptResponseContent || [];
  } catch (error) {
    return;
  }
};
