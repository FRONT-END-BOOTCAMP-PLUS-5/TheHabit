import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { getRoutinesByChallenge } from '@/libs/api/routines.api';

export const ValidateFeedBackGPTResponse = async (
  challengeId: number,
  routineCompletion: RoutineCompletionDto[],
  nickname: string
) => {
  try {
    const response = await getRoutinesByChallenge(challengeId, nickname);

    const routines = response.data || [];

    const routineWithCompletion = routines.map(routine => {
      const completion = routineCompletion.find(completion => completion.routineId === routine.id);
      return {
        ...routine,
        content: completion?.content,
      };
    });

    if (routineWithCompletion.length === 0) {
      console.log('루틴이 없습니다.');
      return [];
    }

    const routineStatusMessages = routineWithCompletion?.map(routine => {
      const isSuccess = routine.content !== null && routine.content !== undefined; // 콘텐츠가 없으면? 실패
      const status = isSuccess ? '성공' : '실패';
      return `${routine.routineTitle}: ${status}`;
    });

    return routineStatusMessages;
  } catch (error) {
    console.error('루틴 상태 메시지 생성 중 오류:', error);
    return;
  }
};
