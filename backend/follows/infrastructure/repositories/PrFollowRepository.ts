import { IFollowRepository } from '@/backend/follows/domain/repositories/IFollowRepository';
import {
  Follower,
  FollowerFollowing,
  Following,
} from '@/backend/follows/domain/entities/FollowEntity';
import { assertSupabaseData } from '@/backend/shared/utils/supabaseHelpers';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type UserRow = {
  id: string;
  nickname: string;
  username: string;
  profile_img: string | null;
  profile_img_path: string | null;
};

type FollowRow = {
  from_user_id: string;
  to_user_id: string;
};

type RelatedUserRow = {
  id: string;
  nickname: string;
  username: string;
  profile_img: string | null;
};

export class PrFollowRepository implements IFollowRepository {
  /**
   * 해당 메소드는 following 생성
   * @param fromUserId: string
   * @param toUserId: string
   * @return boolean
   * */
  async create(fromUserId: string, toUserId: string): Promise<boolean | undefined> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('follows')
        .insert({
          from_user_id: fromUserId,
          to_user_id: toUserId,
        })
        .select()
        .single();

      const addFollowing = assertSupabaseData<FollowRow>(data, error);
      return !!addFollowing;
    } catch (e) {
      if (e instanceof Error) throw new Error(e.message);
    }
  }

  /**
   * 해당 메소드는 팔로우한지를 체크 findFollowStatus
   * @param fromUserId: string
   * @param toUserId: string
   * @return
   * */
  async findFollowStatus(
    fromUserId: string,
    toUserId: string
  ): Promise<FollowerFollowing | null | undefined> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('follows')
        .select('from_user_id, to_user_id')
        .eq('from_user_id', fromUserId)
        .eq('to_user_id', toUserId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      return new FollowerFollowing(data.from_user_id, data.to_user_id);
    } catch (e) {
      if (e instanceof Error) throw new Error(e.message);
    }
  }

  /**
   * 해당 메소드는 follower
   * @param toUserId: string
   * @return follower
   * */
  async findByToUserId(toUserId: string, keyword: string = ''): Promise<Follower | undefined> {
    try {
      const supabase = getSupabaseAdmin();

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, nickname, username, profile_img, profile_img_path')
        .eq('id', toUserId)
        .maybeSingle();

      if (userError) {
        throw new Error(userError.message);
      }
      if (!user) {
        return undefined;
      }

      const { data: followLinks, error: followError } = await supabase
        .from('follows')
        .select('from_user_id')
        .eq('to_user_id', toUserId);

      if (followError) {
        throw new Error(followError.message);
      }

      const fromUserIds = (followLinks ?? []).map(link => link.from_user_id);
      let relatedUsers: RelatedUserRow[] = [];

      if (fromUserIds.length > 0) {
        let usersQuery = supabase
          .from('users')
          .select('id, nickname, username, profile_img')
          .in('id', fromUserIds);

        if (keyword) {
          usersQuery = usersQuery.ilike('username', `%${keyword}%`);
        }

        const { data: fromUsers, error: fromUsersError } = await usersQuery;

        if (fromUsersError) {
          throw new Error(fromUsersError.message);
        }

        relatedUsers = (fromUsers ?? []) as RelatedUserRow[];
      }

      const typedUser = user as UserRow;

      return new Follower(
        typedUser.id,
        typedUser.nickname,
        typedUser.username,
        typedUser.profile_img,
        typedUser.profile_img_path,
        relatedUsers.map(fromUser => ({
          fromUser: {
            id: fromUser.id,
            nickname: fromUser.nickname,
            username: fromUser.username,
            profileImg: fromUser.profile_img,
          },
        }))
      );
    } catch (e) {
      if (e instanceof Error) throw new Error(e.message);
    }
  }

  /**
   * 해당 메소드는 following
   * @param fromUserId: string
   * @return following
   * */
  async findByFromUserId(fromUserId: string, keyword: string = ''): Promise<Following | undefined> {
    try {
      const supabase = getSupabaseAdmin();

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, nickname, username, profile_img, profile_img_path')
        .eq('id', fromUserId)
        .maybeSingle();

      if (userError) {
        throw new Error(userError.message);
      }
      if (!user) {
        return undefined;
      }

      const { data: followLinks, error: followError } = await supabase
        .from('follows')
        .select('to_user_id')
        .eq('from_user_id', fromUserId);

      if (followError) {
        throw new Error(followError.message);
      }

      const toUserIds = (followLinks ?? []).map(link => link.to_user_id);
      let relatedUsers: RelatedUserRow[] = [];

      if (toUserIds.length > 0) {
        let usersQuery = supabase
          .from('users')
          .select('id, nickname, username, profile_img')
          .in('id', toUserIds);

        if (keyword) {
          usersQuery = usersQuery.ilike('username', `%${keyword}%`);
        }

        const { data: toUsers, error: toUsersError } = await usersQuery;

        if (toUsersError) {
          throw new Error(toUsersError.message);
        }

        relatedUsers = (toUsers ?? []) as RelatedUserRow[];
      }

      const typedUser = user as UserRow;

      return new Following(
        typedUser.id,
        typedUser.nickname,
        typedUser.username,
        typedUser.profile_img,
        relatedUsers.map(toUser => ({
          toUser: {
            id: toUser.id,
            nickname: toUser.nickname,
            username: toUser.username,
            profileImg: toUser.profile_img,
          },
        }))
      );
    } catch (e) {
      if (e instanceof Error) throw new Error(e.message);
    }
  }

  /**
   * 해당 메소드는 unfollow
   * @param fromUserId: string
   * @param toUserId: string
   * @return boolean
   * */
  async delete(fromUserId: string, toUserId: string): Promise<boolean | undefined> {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('from_user_id', fromUserId)
        .eq('to_user_id', toUserId);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (e) {
      if (e instanceof Error) throw new Error(e.message);
    }
  }
}
