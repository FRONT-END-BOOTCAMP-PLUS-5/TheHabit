import prisma from '@/public/utils/prismaClient';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { User } from '@/backend/users/domains/entities/UserEntity';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { RoutineCompletion } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { UserReviewEntity } from '@/backend/users/domains/entities/UserReviewEntity';
import { Prisma } from '@prisma/client';

export class PrUserRepository implements IUserRepository {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  async create(user: User): Promise<User> {
    try {
      const createdUser = await prisma.user.create({
        data: {
          email: user.email || '',
          nickname: user.nickname,
          password: user.password || '',
          username: user.username,
          profileImg: user.profileImg,
          profileImgPath: user.profileImgPath,
        },
      });

      return new User(
        createdUser.username,
        createdUser.nickname,
        createdUser.profileImg,
        createdUser.profileImgPath,
        createdUser.id,
        createdUser.password,
        createdUser.email
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('사용자 생성에 실패했습니다.');
    }
  }

  /**
   * S3에 프로필 이미지 업로드
   * @param file: File - 업로드할 파일
   * @returns Promise<string[] | undefined> - [signedUrl, key] 또는 undefined
   */
  async createProfileImg(file: File): Promise<string[] | undefined> {
    try {
      const { name, type } = file;
      const key = `${uuidv4()}-${name}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: process.env.AMPLIFY_BUCKET as string,
        Key: key,
        ContentType: type,
        Body: buffer,
      });

      await this.s3.send(command);

      const signedUrl = `https://${process.env.AMPLIFY_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return [signedUrl, key];
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return undefined;
    }
  }

  /**
   * 리뷰(감정표현) 생성
   * @param reviewContent: string - 리뷰 내용
   * @param routineCompletionId: number - 루틴 완료 ID
   * @param userId: string - 사용자 ID
   * @returns Promise<UserReviewEntity | undefined>
   */
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

      return new UserReviewEntity(
        createdReview.id,
        createdReview.reviewContent,
        createdReview.createdAt,
        createdReview.routineCompletionId,
        createdReview.userId
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return undefined;
    }
  }

  /**
   * 사용자 닉네임으로 루틴 완료 데이터 조회
   * @param nickname: string - 사용자 닉네임
   * @param page: number - 페이지 번호
   * @param pageSize: number - 페이지 크기
   * @param categoryId: string - 카테고리 ID
   * @returns Promise<RoutineCompletion[] | undefined>
   */
  async findByUserNicknameRoutineCompletion(
    nickname: string,
    page: number,
    pageSize: number,
    categoryId: string
  ): Promise<RoutineCompletion[] | undefined> {
    try {
      const isAllCategories = categoryId === 'All';

      const query = isAllCategories
        ? { user: { nickname } }
        : { user: { nickname }, categoryId: Number(categoryId) };

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
      return undefined;
    }
  }

  /**
   * 모든 사용자 조회 (닉네임 검색 가능)
   * @returns Promise<User[] | undefined>
   */
  async findAll(): Promise<User[] | undefined> {
    try {
      const users = await prisma.user.findMany();
      return users.map(
        user =>
          new User(
            user.username,
            user.nickname,
            user.profileImg || null,
            user.profileImgPath || null,
            user.id
          )
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return undefined;
    }
  }

  /**
   * 이메일로 사용자 조회
   * @param email: string - 이메일
   * @returns Promise<User | null>
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

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

  /**
   * 루틴 완료에 대한 감정표현 조회
   * @param routineCompletionId: number - 루틴 완료 ID
   * @returns Promise<UserReviewEntity[] | undefined>
   */
  async findUserRoutineCompletionReview(
    routineCompletionId: number
  ): Promise<UserReviewEntity[] | undefined> {
    try {
      const reviews = await prisma.review.findMany({
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

      return reviews.map(
        review =>
          new UserReviewEntity(
            review.id,
            review.reviewContent,
            review.createdAt,
            review.routineCompletionId,
            review.userId,
            review.User
          )
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return undefined;
    }
  }

  /**
   * 이메일 중복 확인
   * @param email: string - 확인할 이메일
   * @returns Promise<boolean>
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return !!user;
    } catch (error) {
      console.error('이메일 존재 여부 확인 중 오류:', error);
      throw error;
    }
  }

  /**
   * 닉네임으로 사용자 조회
   * @param nickname: string - 닉네임
   * @returns Promise<User | null>
   */
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

  /**
   * ID로 사용자 조회
   * @param id: string - 사용자 ID
   * @returns Promise<User | null>
   */
  async findById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
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

  /**
   * 사용자 정보 업데이트
   * @param nickname: string - 업데이트할 사용자의 닉네임
   * @param user: Partial<User> - 업데이트할 사용자 정보
   * @returns Promise<User | null>
   */
  async update(nickname: string, user: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await prisma.user.update({
        where: { nickname },
        data: user,
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
          console.error('해당 닉네임은 이미 사용 중입니다.');
          return null;
        }
      }
      if (error instanceof Error) throw new Error(error.message);
      return null;
    }
  }

  /**
   * 프로필 이미지 업데이트
   * @param nickname: string - 사용자 닉네임
   * @param userProfilePath: string - 기존 프로필 이미지 경로
   * @param file: File - 새 이미지 파일
   * @param type: 'create' | 'update' - 생성 또는 업데이트 타입
   * @returns Promise<User | undefined>
   */
  async updateProfileImg(
    nickname: string,
    userProfilePath: string,
    file: File,
    type: 'create' | 'update'
  ): Promise<User | undefined> {
    try {
      // 업데이트인 경우 기존 이미지 삭제
      if (type === 'update' && userProfilePath) {
        await this.deleteProfileImg(userProfilePath);
      }

      // 새 이미지 업로드
      const uploadResult = await this.createProfileImg(file);
      if (!uploadResult) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const [img, path] = uploadResult;

      // DB 업데이트
      const updatedUser = await prisma.user.update({
        where: { nickname },
        data: {
          profileImg: img,
          profileImgPath: path,
        },
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

  /**
   * 사용자 삭제
   * @param id: string - 삭제할 사용자 ID
   * @returns Promise<boolean>
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return false;
    }
  }

  /**
   * S3에서 프로필 이미지 삭제
   * @param key: string - S3 객체 키
   * @returns Promise<boolean | undefined>
   */
  async deleteProfileImg(key: string): Promise<boolean | undefined> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AMPLIFY_BUCKET as string,
        Key: key,
      });

      await this.s3.send(deleteCommand);
      return true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return undefined;
    }
  }

  /**
   * 루틴 완료에 대한 감정표현 삭제
   * @param reviewContent: string - 삭제할 리뷰 내용
   * @param routineCompletionId: number - 루틴 완료 ID
   * @param userId: string - 사용자 ID
   * @returns Promise<boolean | undefined>
   */
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
      return undefined;
    }
  }

  /**
   * 사용자의 챌린지, 루틴, 팔로우 정보를 포함한 데이터 조회
   * 이 메소드는 인터페이스에 정의되지 않은 추가 메소드입니다.
   * @param nickname: string - 사용자 닉네임
   * @param userId: string - 조회하는 사용자 ID
   * @returns 사용자의 종합 정보
   */
  async findByUserChallengesAndRoutinesAndFollowAndCompletion(nickname: string, userId: string) {
    try {
      const result = await prisma.user.findUnique({
        where: { nickname },
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
                    where: { userId },
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
      return undefined;
    }
  }
}
