import prisma from '@/public/utils/prismaClient';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { User } from '@/backend/users/domains/entities/UserEntity';
import { RoutineCompletion } from '@/backend/routine-completions/domains/entities/routine-completion/routineCompletion';
import { UserReviewEntity } from '@/backend/users/domains/entities/UserReviewEntity';
import { Prisma } from '@prisma/client';
import { s3Service } from '@/backend/shared/services/s3.service';

export class PrUserRepository implements IUserRepository {
  async createProfileImg(profileFile: File): Promise<string[]> {
    try {
      const { imageUrl, key } = await s3Service.uploadImage(profileFile, 'user');
      return [imageUrl, key];
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('프로필 이미지 업로드에 실패했습니다.');
    }
  }

  async create(user: User): Promise<User> {
    try {
      const createdUser = await prisma.user.create({
        data: {
          email: user.email || '',
          nickname: user.nickname,
          password: user.password || '',
          username: user.username,
          profileImg: user.profileImg,
          profileImgPath: user.profileImgPath, // 추가
        },
      });
      return new User(
        createdUser.username,
        createdUser.nickname,
        createdUser.profileImg,
        createdUser.profileImgPath, // profileImgPath 전달
        createdUser.id,
        createdUser.password,
        createdUser.email
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('사용자 생성에 실패했습니다.'); // 기본 에러 메시지
    }
  }

  /**
   * 해당 메소드는 reviews 테이블에 감정표현을 생성
   * @param reviewContent: string
   * @param routineCompletionId: number
   * @param userId: string
   * @return string
   * */
  async createUserReview(
    reviewContent: string,
    routineCompletionId: number,
    userId: string
  ): Promise<UserReviewEntity | undefined> {
    try {
      const createdReview = await prisma.review.create({
        data: {
          reviewContent,
          routineCompletionId,
          userId,
        },
      });

      return createdReview;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  /**
   * 해당 메소드는 challenges, routines, routines_completions 테이블을 inner 조인하여 가져옴
   * 예시) 21일 챌린지 도전중 or 66일 챌린지 도전중 or 연속 챌린지 도전중
   * 그러면 그 챌린지에 맞는 루틴을 가져오면서 해당 루틴이 실패했는지 안했는지도 completion으로 판단하면됨 아님말고~
   * @param nickname: string
   * @return UserChallengesAndRoutinesAndFollowAndCompletion
   * */
  async findByUserChallengesAndRoutinesAndFollowAndCompletion(nickname: string, userId: string) {
    try {
      const result = await prisma.user.findUnique({
        where: {
          nickname,
        },
        select: {
          id: true,
          nickname: true,
          username: true,
          profileImg: true,
          profileImgPath: true,
          challenges: {
            select: {
              id: true,
              name: true,
              createdAt: true,
              endAt: true,
              active: true,
              routines: {
                select: {
                  id: true,
                  routineTitle: true,
                  emoji: true,
                  createdAt: true,
                  completions: {
                    where: {
                      userId,
                    },
                    select: {
                      id: true,
                      createdAt: true,
                    },
                  },
                },
              },
            },
          },
          following: {
            select: {
              toUserId: true,
            },
          },
          followers: {
            select: {
              fromUserId: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  /**
   * 해당 메소드는 유저 닉네임으로 컴플리션 데이터 가져오는
   * @param nickname: string
   * @return RoutineCompletion[]
   * */
  async findByUserNicknameRoutineCompletion(
    nickname: string,
    page: number,
    pageSize: number,
    categoryId: string
  ): Promise<RoutineCompletion[] | undefined> {
    try {
      let query;
      const check = categoryId === 'All';
      if (check) {
        query = {
          user: {
            nickname,
          },
        };
      } else {
        query = {
          user: {
            nickname,
          },
          categoryId: Number(categoryId),
        };
      }
      const completedRoutines = await prisma.routineCompletion.findMany({
        where: {
          routine: {
            challenge: query,
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          routine: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return completedRoutines;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findAll(username: string = '', myNickName: string): Promise<User[] | undefined> {
    try {
      const users = await prisma.user.findMany({
        where: {
          username: {
            contains: username,
          },
          NOT: {
            nickname: myNickName,
          },
        },
      });
      return users.map(
        user =>
          new User(
            user.username,
            user.nickname,
            user.profileImg || '',
            user.profileImgPath || '',
            user.id || ''
          )
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findByEmail(email: string): Promise<User> {

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });


      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      const userEntity = new User(
        user.username,
        user.nickname,
        user.profileImg,
        user.profileImgPath,
        user.id,
        user.password,
        user.email
      );


      return userEntity;
    } catch (error) {
      throw error; // 에러를 다시 던져서 상위에서 처리하도록 함
    }
  }

  /**
   * 해당 메소드는 유저의 루틴 완료에 전체 감정표현을 가져오는 메소드
   * @param nickname: string
   * @return RoutineCompletion[]
   * */
  async findUserRoutineCompletionReview(
    routineCompletionId: number
  ): Promise<UserReviewEntity[] | undefined> {
    try {
      const userRoutineCompletionReview = await prisma.review.findMany({
        where: {
          routineCompletionId,
        },
        include: {
          User: {
            select: {
              username: true,
              nickname: true,
            },
          },
        },
      });

      return userRoutineCompletionReview;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  // 회원가입용 이메일 중복 체크
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return !!user; // 사용자가 존재하면 true, 없으면 false
    } catch (error) {
      console.error('이메일 존재 여부 확인 중 오류:', error);
      throw error;
    }
  }

  async findByNickname(nickname: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { nickname },
      });

      if (!user) return null;

      return new User(
        user.username,
        user.nickname,
        user.profileImg,
        user.profileImgPath,
        user.id,
        user.password,
        user.email
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) return null;

      return new User(user.username, user.nickname, user.profileImg, user.id);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return null;
    }
  }

  async update(
    user: Partial<User>,
    beforeNickname?: string,
  ): Promise<User | { message: string } | undefined> {
    try {
      const updateData: Partial<User> = { ...user };
      const nickname = beforeNickname
        ? beforeNickname
        : updateData?.nickname
          ? updateData?.nickname
          : '';

      const updatedUser = await prisma.user.update({
        where: { nickname },
        data: updateData,
      });

      return new User(
        updatedUser.username,
        updatedUser.nickname,
        updatedUser.profileImg,
        updatedUser.profileImgPath,
        updatedUser.id,
        updatedUser.password,
        updatedUser.email
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { message: '해당 닉네임은 이미 사용 중입니다.' };
        }
      }
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async updateUserName(id: string, username: string): Promise<User | undefined> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { username },
      });

      return new User(
        updatedUser.username,
        updatedUser.nickname,
        updatedUser.profileImg,
        updatedUser.profileImgPath,
        updatedUser.id,
        updatedUser.password,
        updatedUser.email
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return undefined;
    }
  }

  async delete(nickname: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { nickname },
      });

      return true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return false;
    }
  }

  /**
   * 해당 메소드는 유저의 루틴 완료에 해당 감정표현을 제거하는 메소드
   * @param reviewContent: string
   * @param routineCompletionId: number
   * @param userId: string
   * @return true
   * */
  async deleteUserRoutineCompletionReview(
    reviewContent: string,
    routineCompletionId: number,
    userId: string
  ): Promise<boolean | undefined> {
    try {
      await prisma.review.delete({
        where: {
          reviewContent_routineCompletionId_userId: {
            reviewContent,
            routineCompletionId,
            userId,
          },
        },
      });

      return true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}
