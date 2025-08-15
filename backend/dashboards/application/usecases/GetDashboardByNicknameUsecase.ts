import { IDashboardRepository } from '@/backend/dashboards/domain/repository/IDashboardRepository';
import { Dashboard } from '@/backend/dashboards/domain/entity/Dashboard';

export class GetDashboardByNicknameUsecase {
  constructor(private dashboardRepository: IDashboardRepository) { }

  async execute(nickname: string): Promise<Dashboard | null> {
    try {
      console.log('🔍 GetDashboardByNicknameUsecase 실행:', nickname);

      if (!nickname || nickname.trim() === '') {
        throw new Error('닉네임이 제공되지 않았습니다.');
      }

      const dashboard = await this.dashboardRepository.findByNickname(nickname.trim());

      if (!dashboard) {
        console.log('❌ 대시보드를 찾을 수 없음:', nickname);
        return null;
      }

      console.log('✅ 대시보드 조회 성공:', {
        nickname,
        challengeName: dashboard.challenge?.name || '챌린지 없음',
        routineCount: dashboard.routineCount
      });

      return dashboard;
    } catch (error) {
      console.error('❌ GetDashboardByNicknameUsecase 실행 중 오류:', error);
      throw new Error(`닉네임으로 대시보드 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }
}
