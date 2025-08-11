import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";
import { User } from "@/backend/users/domains/entities/UserEntity";
import prisma from "@/public/utils/prismaClient";

export class PrUserRepository implements IUserRepository {
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



  async update(id: string, nickname: string): Promise<boolean | undefined> {
    try{
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { nickname },
      });

      return updatedUser ? true : false;
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

}
