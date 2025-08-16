import { Dashboard } from '../entity/Dashboard';

// 대시보드 리포지토리 인터페이스
export interface IDashboardRepository {
  // 사용자 닉네임으로 대시보드 조회
  findByNickname(nickname: string): Promise<Dashboard | null>;

  // 모든 사용자의 대시보드 조회
  findAll(): Promise<Dashboard[]>;
}
