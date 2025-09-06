import { IDashboardRepository } from '@/backend/dashboards/domain/repository/IDashboardRepository';
import { Dashboard } from '@/backend/dashboards/domain/entity/Dashboard';

export class GetDashboardByNicknameUsecase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(nickname: string): Promise<Dashboard | null> {
    try {
      if (!nickname || nickname.trim() === '') {
        throw new Error('닉네임이 제공되지 않았습니다.');
      }

      const dashboard = await this.dashboardRepository.findByNickname(nickname.trim());

      if (!dashboard) {
        return null;
      }

      return dashboard;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('알 수 없는 오류');
    }
  }
}
