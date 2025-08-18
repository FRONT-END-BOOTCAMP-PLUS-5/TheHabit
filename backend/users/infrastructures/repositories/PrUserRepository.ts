import prisma from '@/public/utils/prismaClient';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import { User } from '@/backend/users/domains/entities/UserEntity';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { RoutineCompletion } from '@/backend/routine-completions/domains/entities/routine-completion/routineCompletion';
import { v4 as uuidv4 } from 'uuid';

import { Prisma } from '@prisma/client';
import { UserReviewEntity } from '@/backend/users/domains/entities/UserReviewEntity';

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
   * 해당 메소드는 s3에 이미지 생성
   * @param fromUserId: string
   * @param toUserId: string
   * @return string
   * */
  async createProfileImg(file: File): Promise<string[] | undefined> {
    try {
      const { name, type } = file

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

      const signedUrl: string = `https://${process.env.AMPLIFY_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;


      return [signedUrl, key];
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
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

  async findAll(nickname: string = ''): Promise<User[] | undefined> {
    try {
      const users = await prisma.user.findMany({
        where: {
          nickname: {
            contains: nickname,
          },
        },
      });
      return users.map(
        user => new User(user.username, user.nickname, user.profileImg || '', user.id || '')
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findByEmail(email: string): Promise<User> {
    console.log('🔍 PrUserRepository.findByEmail 시작');
    console.log('📧 조회할 이메일:', email);

    try {
      console.log('📡 Prisma 쿼리 실행: findUnique({ where: { email } })');
      const user = await prisma.user.findUnique({
        where: { email },
      });

      console.log('📊 Prisma 쿼리 결과:', user);

      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      console.log('✅ 사용자 발견, User 객체 생성 시작');
      console.log('👤 원본 사용자 데이터:', {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        profileImg: user.profileImg,
        password: user.password ? '***' : 'undefined',
        email: user.email,
      });

      const userEntity = new User(
        user.username,
        user.nickname,
        user.profileImg,
        null, // profileImgPath
        user.id,
        user.password,
        user.email
      );

      console.log('🏗️ 생성된 User 엔티티:', {
        id: userEntity.id,
        username: userEntity.username,
        nickname: userEntity.nickname,
        profileImg: userEntity.profileImg,
        hasPassword: !!userEntity.password,
        email: userEntity.email,
      });

      return userEntity;
    } catch (error) {
      console.error('💥 PrUserRepository.findByEmail 오류:', error);
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
        null, // profileImgPath
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

  async update(id: string, user: Partial<User>): Promise<User | null> {
    try {
      const updateData: Partial<User> = user;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      return new User(
        updatedUser.username,
        updatedUser.nickname,
        updatedUser.profileImg,
        null, // profileImgPath
        updatedUser.id,
        updatedUser.password,
        updatedUser.email
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return null;
    }
  }

  async updateUserName(id: string, username: string): Promise<User | undefined> {
    try {
      const updatedUserName = await prisma.user.update({
        where: { id },
        data: { username },
      });

      return updatedUserName;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async updateUserNickname(
    id: string,
    nickname: string
  ): Promise<User | { message: string } | undefined> {
    try {
      const updatedUserNickname = await prisma.user.update({
        where: { id },
        data: { nickname },
      });

      return updatedUserNickname;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { message: '해당 닉네임은 이미 사용 중입니다.' };
        }
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  /**
   * 해당 메소드는 s3 이미지 업데이트
   * @param fromUserId: string
   * @param toUserId: string
   * @return boolean
   * */

  async updateProfileImg(
    id: string,
    userProfilePath: string,
    file: File,
    type: 'create' | 'update'
  ): Promise<User | undefined> {
    try {
      if (type === 'update') await this.deleteProfileImg(userProfilePath);

      const signedUrl = await this.createProfileImg(file);
      const img = (signedUrl?.length && signedUrl[0]) || '';
      const path = (signedUrl?.length && signedUrl[1]) || '';

      const updatedUserName = await prisma.user.update({
        where: { id },
        data: { profileImg: img, profileImgPath: path },
      });

      return updatedUserName;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

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
   * 해당 메소드는 s3 기존 이미지 삭제
   * @param fromUserId: string
   * @param toUserId: string
   * @return boolean
   * */
  async deleteProfileImg(userProfileImgPath: string): Promise<boolean | undefined> {
    try {
      const userProfile = `${userProfileImgPath}`;
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AMPLIFY_BUCKET as string,
        Key: userProfile,
      });

      await this.s3.send(deleteCommand);

      return true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
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