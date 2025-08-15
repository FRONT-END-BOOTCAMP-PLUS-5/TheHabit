import { IDashboardRepository } from '@/backend/dashboards/domain/repository/IDashboardRepository';
import { Dashboard } from '@/backend/dashboards/domain/entity/Dashboard';
import { Challenge } from '@/backend/challenges/domains/entities/Challenge';
import { Routine } from '@/backend/routines/domains/entities/routine';
import { RoutineCompletion } from '@/backend/routine-completions/domains/entities/routine-completion/routineCompletion';
import prisma from '@/public/utils/prismaClient';

export class PrDashboardRepository implements IDashboardRepository {

  // 사용자 닉네임으로 대시보드 조회
  async findByNickname(nickname: string): Promise<Dashboard | null> {
    try {
      console.log('🔍 닉네임으로 대시보드 조회 시작:', nickname);

      // 사용자 정보와 함께 챌린지와 루틴을 join해서 조회
      const userData = await prisma.user.findUnique({
        where: { nickname },
        include: {
          challenges: {
            include: {
              routines: {
                include: {
                  completions: true // 루틴 완료 정보도 함께 가져오기
                }
              },
              category: true // 챌린지 카테고리 정보도 함께
            }
          }
        }
      });

      if (!userData) {
        console.log('❌ 사용자를 찾을 수 없음:', nickname);
        return null;
      }

      console.log('✅ 사용자 데이터 조회 완료:', {
        userId: userData.id,
        nickname: userData.nickname,
        challengeCount: userData.challenges.length
      });

      // Dashboard 엔티티로 변환
      const dashboard = this.mapToDashboard(userData);

      console.log('✅ 대시보드 변환 완료');

      return dashboard;
    } catch (error) {
      console.error('❌ 닉네임으로 대시보드 조회 중 오류:', error);
      throw new Error(`대시보드 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  // 모든 사용자의 대시보드 조회
  async findAll(): Promise<Dashboard[]> {
    try {
      console.log('🔍 모든 사용자 대시보드 조회 시작');

      // 모든 사용자의 챌린지와 루틴을 join해서 조회
      const allUsersData = await prisma.user.findMany({
        include: {
          challenges: {
            include: {
              routines: {
                include: {
                  completions: true
                }
              },
              category: true
            }
          }
        }
      });

      console.log('✅ 전체 사용자 데이터 조회 완료:', allUsersData.length);

      // 각 사용자별로 Dashboard 엔티티로 변환
      const dashboards = allUsersData.map(userData =>
        this.mapToDashboard(userData)
      );

      console.log('✅ 대시보드 변환 완료:', dashboards.length);

      return dashboards;
    } catch (error) {
      console.error('❌ 모든 사용자 대시보드 조회 중 오류:', error);
      throw new Error(`전체 대시보드 조회에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
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
      startTime: Date | null;
      endTime: Date | null;
      color: string;
      userId: string;
      categoryId: number;
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
          userId: string;
          routineId: number;
          content: string | null;
        }>;
      }>;
    }>;
  }): Dashboard {
    const challenges = userData.challenges || [];

    if (challenges.length === 0) {
      // 챌린지가 없는 경우 기본 Challenge 객체로 Dashboard 생성
      const defaultChallenge = new Challenge(
        0, // 기본 ID
        '챌린지 없음', // 기본 이름
        new Date(), // 기본 생성일
        new Date(), // 기본 종료일
        null, // 기본 시작 시간
        null, // 기본 종료 시간
        '#CCCCCC', // 기본 색상
        userData.id, // 사용자 ID
        0 // 기본 카테고리 ID
      );

      return new Dashboard(
        defaultChallenge,
        [],
        0,
        [] // 챌린지가 없는 경우 빈 completions 배열
      );
    }

    // 첫 번째 챌린지와 그 루틴들로 Dashboard 생성
    const firstChallenge = challenges[0];

    // Challenge 엔티티 생성
    const challenge = new Challenge(
      firstChallenge.id,
      firstChallenge.name,
      firstChallenge.createdAt,
      firstChallenge.endAt,
      firstChallenge.startTime,
      firstChallenge.endTime,
      firstChallenge.color,
      firstChallenge.userId,
      firstChallenge.categoryId
    );

    // Routine 엔티티들 생성
    const routines = firstChallenge.routines.map((routineData: {
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
        userId: string;
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

      // completions 정보를 routine에 추가 (routine 엔티티에 completions 속성이 있다고 가정)
      // 만약 Routine 엔티티에 completions 속성이 없다면, 별도로 관리하거나 DTO로 변환해야 함
      return routine;
    });

    // 모든 루틴의 completions를 수집
    const allCompletions: RoutineCompletion[] = [];
    firstChallenge.routines.forEach(routineData => {
      routineData.completions.forEach(completionData => {
        const completion = new RoutineCompletion(
          completionData.id,
          completionData.userId,
          completionData.routineId,
          completionData.createdAt,
          completionData.proofImgUrl
        );
        allCompletions.push(completion);
      });
    });

    // Dashboard 엔티티 생성
    return new Dashboard(
      challenge,
      routines,
      routines.length,
      allCompletions
    );
  }
}
