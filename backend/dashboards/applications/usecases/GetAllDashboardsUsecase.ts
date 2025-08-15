import { IDashboardRepository } from '@/backend/dashboards/domain/repository/IDashboardRepository';
import { Dashboard } from '@/backend/dashboards/domain/entity/Dashboard';

export class GetAllDashboardsUsecase {
  constructor(private dashboardRepository: IDashboardRepository) { }

  async execute(): Promise<Dashboard[]> {
    try {
      console.log('🔍 GetAllDashboardsUsecase 실행');

      const dashboards = await this.dashboardRepository.findAll();

      console.log('✅ 전체 대시보드 조회 성공:', {
        totalCount: dashboards.length,
        summary: dashboards.map(dashboard => ({
          challengeName: dashboard.challenge?.name || '챌린지 없음',
          routineCount: dashboard.routineCount
        }))
      });

      return dashboards;
    } catch (error) {
      console.error('❌ GetAllDashboardsUsecase 실행 중 오류:', error);
      throw new Error(`전체 대시보드 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }
}
