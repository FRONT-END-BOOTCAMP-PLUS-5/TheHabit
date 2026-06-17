import { FeedbackApi, getFeedBackByChallengeId } from '@/libs/api/feedback.api';
import { RoutineCompletionDto } from '@/backend/routine-completions/application/dtos/RoutineCompletionDto';
import { ValidateFeedBackAiResponse } from '@/app/user/feedback/_components/ValidateFeedBackAiResponse';
import { requestAI } from '@/libs/api/ai.api';

export const FeedBackPostData = async (
  challengeId: number,
  routineCompletion: RoutineCompletionDto[],
  nickname: string
): Promise<string> => {
  const validateChallenge = await getFeedBackByChallengeId(challengeId, nickname);

  if (!validateChallenge.success) {
    throw new Error(validateChallenge.error?.message ?? '피드백 조회에 실패했습니다.');
  }

  const existingFeedback = validateChallenge.data?.aiResponseContent;
  if (existingFeedback?.trim()) {
    return existingFeedback;
  }

  const routineStatusMessagesGPTResponse = await ValidateFeedBackAiResponse(
    challengeId,
    routineCompletion,
    nickname
  );

  if (!routineStatusMessagesGPTResponse?.length) {
    throw new Error('피드백을 생성할 루틴 데이터가 부족합니다.');
  }

  const aiResponse = await requestAI({
    aiResponseContent: routineStatusMessagesGPTResponse.join('\n'),
  });

  const aiContent = aiResponse.data?.aiResponseContent?.trim();
  if (!aiContent) {
    throw new Error('AI 피드백 생성에 실패했습니다.');
  }

  const feedBack = await FeedbackApi(
    {
      aiResponseContent: aiContent,
      challengeId,
    },
    nickname
  );

  if (!feedBack.success) {
    throw new Error(feedBack.error?.message ?? '피드백 저장에 실패했습니다.');
  }

  const savedContent = feedBack.data?.aiResponseContent?.trim();
  if (!savedContent) {
    throw new Error('피드백 저장에 실패했습니다.');
  }

  return savedContent;
};
