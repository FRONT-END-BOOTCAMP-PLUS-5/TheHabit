import { IDashboardRepository } from '@/backend/dashboards/domain/repository/IDashboardRepository';
import { Dashboard } from '@/backend/dashboards/domain/entity/Dashboard';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';
import { Routine } from '@/backend/routines/domains/entities/routine';
import { RoutineCompletion } from '@/backend/routine-completions/domains/entities/routineCompletion';
import prisma from '@/public/utils/prismaClient';

export class PrDashboardRepository implements IDashboardRepository {
  // 사용자 닉네임으로 대시보드 조회
  async findByNickname(nickname: string): Promise<Dashboard | null> {
    try {
      // 사용자 정보와 함께 챌린지와 루틴을 join해서 조회
      const userData = await prisma.user.findUnique({
        where: { nickname },
        include: {
          challenges: {
            include: {
              routines: {
                include: {
                  completions: true, // 루틴 완료 정보도 함께 가져오기
                },
              },
              category: true, // 챌린지 카테고리 정보도 함께
            },
          },
        },
      });

      if (!userData) {
        return null;
      }

      // Dashboard 엔티티로 변환
      const dashboard = this.mapToDashboard(userData);

      return dashboard;
    } catch (error) {
      throw new Error(
        `대시보드 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }

  // 모든 사용자의 대시보드 조회
  async findAll(): Promise<Dashboard[]> {
    try {
      // 모든 사용자의 챌린지와 루틴을 join해서 조회
      const allUsersData = await prisma.user.findMany({
        include: {
          challenges: {
            include: {
              routines: {
                include: {
                  completions: true,
                },
              },
              category: true,
            },
            select: {
              id: true,
              name: true,
              createdAt: true,
              endAt: true,
              color: true,
              userId: true,
              categoryId: true,
              active: true,
              completion_progress: true,
            },
          },
        },
      });

      // 각 사용자별로 Dashboard 엔티티로 변환
      const dashboards = allUsersData.map(userData => this.mapToDashboard(userData));

      return dashboards;
    } catch (error) {
      throw new Error(
        `전체 대시보드 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  }

  // Prisma 결과를 Dashboard 엔티티로 변환하는 헬퍼 메서드
  private mapToDashboard(userData: {
    id: string;
    challenges: Array<{
      id: number;
      name: string;
      createdAt: Date;
      endAt: Date;
      color: string;
      userId: string;
      categoryId: number;
      active: boolean;
      completion_progress: string;
      routines: Array<{
        id: number;
        routineTitle: string;
        alertTime: Date | null;
        emoji: number;
        challengeId: number;
        createdAt: Date;
        updatedAt: Date;
        completions: Array<{
          id: number;
          createdAt: Date;
          proofImgUrl: string | null;
          routineId: number;
          content: string | null;
        }>;
      }>;
    }>;
  }): Dashboard {
    const challenges = userData.challenges || [];

    if (challenges.length === 0) {
      // 챌린지가 없는 경우 빈 배열로 대시보드를 구성
      return new Dashboard([], [], 0, []);
    }

    // 모든 챌린지들을 Challenge 엔티티로 변환
    const challengeEntities = challenges.map(challengeData =>
      new Challenge(
        challengeData.name,
        challengeData.createdAt,
        challengeData.endAt,
        challengeData.color,
        challengeData.userId,
        challengeData.categoryId,
        challengeData.active,
        challengeData.completion_progress || 'in_progress',
        challengeData.id // id
      )
    );

    // 모든 챌린지의 루틴들을 수집
    const allRoutines: Routine[] = [];
    challenges.forEach(challengeData => {
      const routines = challengeData.routines.map(
        (routineData: {
          id: number;
          routineTitle: string;
          alertTime: Date | null;
          emoji: number;
          challengeId: number;
          createdAt: Date;
          updatedAt: Date;
          completions: Array<{
            id: number;
            createdAt: Date;
            proofImgUrl: string | null;
            routineId: number;
            content: string | null;
          }>;
        }) => {
          // Routine 엔티티 생성
          const routine = new Routine(
            routineData.id,
            routineData.routineTitle,
            routineData.alertTime,
            routineData.emoji,
            routineData.challengeId,
            routineData.createdAt,
            routineData.updatedAt
          );

          return routine;
        }
      );
      allRoutines.push(...routines);
    });

    // 모든 루틴의 completions를 수집
    const allCompletions: RoutineCompletion[] = [];
    challenges.forEach(challengeData => {
      challengeData.routines.forEach(routineData => {
        routineData.completions.forEach(completionData => {
          const completion = new RoutineCompletion(
            completionData.id,
            '',
            completionData.routineId,
            completionData.createdAt,
            completionData.proofImgUrl,
            completionData.content
          );
          allCompletions.push(completion);
        });
      });
    });

    // Dashboard 엔티티 생성 (모든 챌린지, 모든 루틴, 모든 완료 기록 포함)
    return new Dashboard(challengeEntities, allRoutines, allRoutines.length, allCompletions);
  }
}
