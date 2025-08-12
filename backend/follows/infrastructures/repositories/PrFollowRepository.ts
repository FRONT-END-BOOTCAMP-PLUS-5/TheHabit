import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";
import { User } from "@/backend/users/domains/entities/UserEntity";
import prisma from "@/public/utils/prismaClient";
import {IFollowRepository} from "@/backend/follows/domains/repositories/IFollowRepository";
import {Follower, FollowerFollowing, Following} from "@/backend/follows/domains/entities/FollowEntity";

export class PrFollowRepository implements IFollowRepository{
  /**
   * 해당 메소드는 following 생성
   * @param fromUserId: string
   * @param toUserId: string
   * @return boolean
   * */
  async create(fromUserId: string, toUserId: string): Promise<boolean | undefined> {
    try{
      const addFollowing = await prisma.follow.create({
        data: {
          fromUserId,
          toUserId
        }
      })

      return !!addFollowing;

    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }
  }

  /**
   * 해당 메소드는 팔로우한지를 체크 findFollowStatus
   * @param fromUserId: string
   * @param toUserId: string
   * @return
   * */
  async findFollowStatus(fromUserId: string, toUserId: string): Promise<FollowerFollowing | null | undefined> {
    try{
      const status = await prisma.follow.findUnique({
        where: {
          fromUserId_toUserId: {
            fromUserId,
            toUserId,
          },
        },
      });

      return status;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }
  }

  /**
   * 해당 메소드는 follower
   * @param toUserId: string
   * @return follower
   * */
  async findByToUserId(toUserId:string, keyword: string = ''): Promise<Follower | undefined> {
    try{
      const followers = await prisma.user.findUnique({
        where: {
          id: toUserId,
        },
        include: {
          followers: {
            where: {
              fromUser: {
                username: {
                  contains: keyword,
                },
              },
            },
            select: {
              fromUser: {
                select: {
                  id: true,
                  nickname: true,
                  username: true,
                  profileImg: true
                }
              }
            }
          },
        },
      });

      if(followers) return followers;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }

  /**
   * 해당 메소드는 following
   * @param fromUserId: string
   * @return following
   * */
  async findByFromUserId(fromUserId: string, keyword: string = ''): Promise<Following | undefined> {
    try{
      const followings = await prisma.user.findUnique({
        where: {
          id: fromUserId,
        },
        include: {
          following: {
            where: {
              toUser: {
                username: {
                  contains: keyword,
                },
              },
            },
            select: {
              toUser: {
                select: {
                  id: true,
                  nickname: true,
                  username: true,
                  profileImg: true
                }
              }
            }
          },
        },
      });

      if(followings) return followings;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }


  /**
   * 해당 메소드는 unfollow
   * @param fromUserId: string
   * @param toUserId: string
   * @return boolean
   * */
  async delete(fromUserId: string, toUserId: string): Promise<boolean | undefined> {
    try{
     await prisma.follow.delete({
        where: {
          fromUserId_toUserId: {
            fromUserId,
            toUserId
          }
        }
      });

      return true;
    }catch(e){
      if(e instanceof  Error) throw new Error(e.message)
    }

  }

}
