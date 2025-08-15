import { DashboardDto } from './DashboardDto';

export interface DashboardListDto {
  dashboards: DashboardDto[];
  totalCount: number;
}

export interface DashboardSummaryDto {
  nickname: string;
  challengeName: string | null;
  routineCount: number;
  lastActivity?: Date; // 마지막 활동 시간
}
