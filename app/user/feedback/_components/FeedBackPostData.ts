import { FeedbackApi, getFeedBackByChallengeId } from '@/libs/api/feedback.api';
import { requestGPT } from '@/libs/api/gpt.api';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { ValidateFeedBackGPTResponse } from '@/app/user/feedback/_components/ValidateFeedBackGPTResponse';

export const FeedBackPostData = async (
  challengeId: number,
  routineCompletion: RoutineCompletionDto[]
) => {
  try {
    const feedBackData = await getFeedBackByChallengeId(challengeId);
    console.log('feedBackData', feedBackData);

    // 기존 피드백이 있으면 그 데이터 반환
    if (feedBackData.data?.gptResponseContent && feedBackData.data.gptResponseContent.length > 0) {
      console.log('기존 피드백이 있습니다.');
      return feedBackData.data.gptResponseContent;
    }

    // 피드백이 없으면 새로 생성
    const routineStatusMessagesGPTResponse = await ValidateFeedBackGPTResponse(
      challengeId,
      routineCompletion
    );

    if (!routineStatusMessagesGPTResponse || routineStatusMessagesGPTResponse.length === 0) {
      console.log('루틴 상태 메시지가 없습니다.');
      return [];
    }

    const gptResponse = await requestGPT({
      gptResponseContent: routineStatusMessagesGPTResponse,
    });

    if (!gptResponse.data?.gptResponseContent) {
      console.log('GPT 응답이 없습니다.');
      return [];
    }

    const feedBack = await FeedbackApi({
      gptResponseContent: gptResponse.data.gptResponseContent,
      challengeId: challengeId,
    });

    console.log('새 피드백 생성:', feedBack);
    return feedBack.data?.gptResponseContent || [];
  } catch (error) {
    console.error('피드백 데이터 처리 중 오류:', error);
    return [];
  }
};
