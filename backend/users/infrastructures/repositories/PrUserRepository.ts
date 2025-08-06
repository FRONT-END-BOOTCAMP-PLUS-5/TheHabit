import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";
import { User } from "@/backend/users/domains/entities/UserEntity";
import prisma from "@/public/utils/prismaClient";

export class PrUserRepository implements IUserRepository {
  async create(user: User): Promise<User | undefined> {
    try{
      // prisma 쿼리문 사용법
      // insert, update, select 등 밑에 해놓음 예제
      const createdUser:User = await prisma.$queryRaw`
            INSERT INTO users (email, nickname, password, username, profile_img)
            VALUES (
                ${user.email}, 
                ${user.nickname},
                ${user.password}, 
                ${user.username},
                ${user.profileImg},
                )
            RETURNING id, email, nickname, username, profile_img as "profileImg";`

      return new User(
          createdUser.username,
          createdUser.nickname,
          createdUser.profileImg,
          createdUser.id,
      );
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }
  }

  async findAll(nickname: string = ''): Promise<User[] | undefined> {
    try{
      const users:User[] = await prisma.$queryRaw`
        SELECT id,
           username,
           nickname,
           profile_img as "profileImg"
        FROM users
        WHERE 1=1
        AND nickname like '%${nickname}%'
        ;`

      return users.map((user: User) => new User(
          user.username,
          user.nickname,
          user.profileImg || '',
          user.id || '',
      ));
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }

  async findById(id: string): Promise<User | null | undefined> {
    try{
      const user: User = await prisma.$queryRaw`
        SELECT id,
               username,
               nickname,
               profile_img as "profileImg"
        FROM users
        WHERE 1=1
        AND id = ${id}
        ;`

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
      const updatedUser = await prisma.$queryRaw`
        UPDATE
            users
        SET
            nickname = ${nickname}
        WHERE 1=1
        AND id = ${id};
        ;`

      return updatedUser ? true : false;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }

  async delete(id: string): Promise<boolean | undefined> {
    try{
      const deletedUser = await prisma.$queryRaw`
        DELETE
        FROM users
        WHERE id = ${id};
        ;`

      return deletedUser ? true : false;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }

}
