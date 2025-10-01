import { IDashboardRepository } from '@/backend/dashboards/domain/repository/IDashboardRepository';
import { Dashboard } from '@/backend/dashboards/domain/entities/Dashboard';

export class GetAllDashboardsUsecase {
  constructor(private dashboardRepository: IDashboardRepository) { }

  async execute(): Promise<Dashboard[]> {
    try {
      const dashboards = await this.dashboardRepository.findAll();

      return dashboards;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('알 수 없는 오류');
    }
  }
}
