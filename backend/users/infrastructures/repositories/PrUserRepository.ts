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
