import prisma from "@/public/utils/prismaClient";
import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";
import { User } from "@/backend/users/domains/entities/UserEntity";
import {DeleteObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {v4 as uuidv4} from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Prisma } from "@prisma/client";

export class PrUserRepository implements IUserRepository {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  async create(user: User): Promise<User | undefined> {
    try{
      const createdUser = await prisma.user.create({
        data: {
          email: user.email || '',
          nickname: user.nickname,
          password: user.password || '',
          username: user.username,
          profileImg: user.profileImg,
        }
      })
      return new User(
          createdUser.username,
          createdUser.nickname,
          createdUser.profileImg,
          createdUser.id,
          createdUser.password
      );
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }
  }

  /**
   * 해당 메소드는 s3에 이미지 생성
   * @param fromUserId: string
   * @param toUserId: string
   * @return string
   * */
  async createProfileImg(file: File): Promise<string[] | undefined> {
    try{
      const { name, type } = file

      const key = `${uuidv4()}-${name}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: process.env.AMPLIFY_BUCKET as string,
        Key: key,
        ContentType: type,
        Body: buffer
      });

      this.s3.send(command);

      const signedUrl:string = `https://${process.env.AMPLIFY_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;;


      return [signedUrl, key];

    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }
  }

  async findAll(nickname: string = ''): Promise<User[] | undefined> {
    try{
      const users = await prisma.user.findMany({
        where:{
          nickname: {
            contains: nickname
          }
        }
      });
      return users.map((user) => new User(
          user.username,
          user.nickname,
          user.profileImg || '',
          user.id || '',
      ));
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }

  async findByEmail(email: string): Promise<User | null | undefined> {
    console.log("🔍 PrUserRepository.findByEmail 시작");
    console.log("📧 조회할 이메일:", email);
    
    try {
      console.log("📡 Prisma 쿼리 실행: findUnique({ where: { email } })");
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      console.log("📊 Prisma 쿼리 결과:", user);
      
      if (!user) {
        console.log("❌ 사용자를 찾을 수 없음");
        return null;
      }

      console.log("✅ 사용자 발견, User 객체 생성 시작");
      console.log("👤 원본 사용자 데이터:", {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        profileImg: user.profileImg,
        password: user.password ? "***" : "undefined",
        email: user.email
      });

      const userEntity = new User(
          user.username,
          user.nickname,
          user.profileImg,
          user.id,
          user.password,  
          user.email     
      );
      
      console.log("🏗️ 생성된 User 엔티티:", {
        id: userEntity.id,
        username: userEntity.username,
        nickname: userEntity.nickname,
        profileImg: userEntity.profileImg,
        hasPassword: !!userEntity.password,
        email: userEntity.email
      });
      
      return userEntity;
    } catch (e) {
      console.error("💥 PrUserRepository.findByEmail 오류:", e);
      if (e instanceof Error) throw new Error(e.message);
    }
  }


  async findById(id: string): Promise<User | null | undefined> {
    try{
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) return null;

      return new User(
          user.username,
          user.nickname,
          user.profileImg,
          user.id,
      );
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }


  async updateUserName(id: string, username: string): Promise<User | undefined> {
    try{
      const updatedUserName = await prisma.user.update({
        where: { id },
        data: { username },
      });

      return updatedUserName;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }

  async updateUserNickname(id: string, nickname: string): Promise<User | {message: string}| undefined> {
    try{
      const updatedUserNickname = await prisma.user.update({
        where: { id },
        data: { nickname },
      });

      return updatedUserNickname;
    }catch(e){
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return { message: "해당 닉네임은 이미 사용 중입니다." };
        }
      }

      if(e instanceof  Error) {
        throw new Error(e.message)
      }
    }

  }

  /**
   * 해당 메소드는 s3 이미지 업데이트
   * @param fromUserId: string
   * @param toUserId: string
   * @return boolean
   * */
  async updateProfileImg(id: string, userProfilePath: string, file:File, type: 'create' | 'update'): Promise<User | undefined> {
    try{
      if(type === "update") await this.deleteProfileImg(userProfilePath)

      const signedUrl = await this.createProfileImg(file)
      const img = signedUrl?.length && signedUrl[0] || '';
      const path = signedUrl?.length && signedUrl[1] || '';

      const updatedUserName = await prisma.user.update({
        where: { id },
        data: { profileImg: img, profileImgPath: path },
      });

      return updatedUserName;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }


  async delete(id: string): Promise<boolean | undefined> {
    try{
     await prisma.user.delete({
        where: { id }
      });

      return true;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }

  /**
   * 해당 메소드는 s3 기존 이미지 삭제
   * @param fromUserId: string
   * @param toUserId: string
   * @return boolean
   * */
  async deleteProfileImg(userProfileImgPath: string): Promise<boolean | undefined> {
    try{
      const userProfile = `${userProfileImgPath}`
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AMPLIFY_BUCKET as string,
        Key: userProfile,
      });

      this.s3.send(deleteCommand);

      return true;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }







}
