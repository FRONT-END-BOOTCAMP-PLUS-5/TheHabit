import { IUserRepository } from '@/backend/users/domain/repositories/IUserRepository';
import { User } from '@/backend/users/domain/entities/UserEntity';
import { RoutineCompletion } from '@/backend/routine-completions/domain/entities/routineCompletion';
import { UserReviewEntity } from '@/backend/users/domain/entities/UserReviewEntity';
import { s3Service } from '@/backend/shared/services/s3.service';
import { assertSupabaseData, isUniqueViolation } from '@/backend/shared/utils/supabaseHelpers';
import { getSupabaseAdmin } from '@/public/utils/supabase/server';

type UserRow = {
  id: string;
  username: string;
  password: string;
  nickname: string;
  profile_img: string | null;
  profile_img_path: string | null;
  email: string;
  created_at?: string;
  updated_at?: string;
};

type ReviewRow = {
  id: number;
  review_content: string;
  created_at: string;
  routine_completion_id: number;
  user_id: string | null;
};

type ReviewUserRow = { username: string; nickname: string };

function resolveReviewUser(users: ReviewUserRow | ReviewUserRow[] | null): ReviewUserRow | null {
  if (!users) return null;
  return Array.isArray(users) ? (users[0] ?? null) : users;
}

type CompletionRow = {
  id: number;
  user_id: string;
  routine_id: number;
  created_at: string;
  proof_img_url: string | null;
  content: string | null;
};

type NestedCompletionRow = {
  id: number;
  created_at: string;
  user_id: string;
};

type NestedRoutineRow = {
  id: number;
  routine_title: string;
  emoji: number;
  created_at: string;
  routines_completions: NestedCompletionRow[] | null;
};

type NestedChallengeRow = {
  id: number;
  name: string;
  created_at: string;
  end_at: string;
  active: boolean;
  routines: NestedRoutineRow[] | null;
};

type UserWithChallengesRow = {
  id: string;
  nickname: string;
  username: string;
  profile_img: string | null;
  profile_img_path: string | null;
  challenges: NestedChallengeRow[] | null;
};

function toUser(row: UserRow): User {
  return new User(
    row.username,
    row.nickname,
    row.profile_img,
    row.profile_img_path,
    row.id,
    row.password,
    row.email
  );
}

function toRoutineCompletion(row: CompletionRow): RoutineCompletion {
  return new RoutineCompletion(
    row.id,
    row.user_id,
    row.routine_id,
    new Date(row.created_at),
    row.proof_img_url,
    row.content
  );
}

function toUserUpdateRow(user: Partial<User>): Record<string, unknown> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (user.username !== undefined) row.username = user.username;
  if (user.nickname !== undefined) row.nickname = user.nickname;
  if (user.password !== undefined) row.password = user.password;
  if (user.email !== undefined) row.email = user.email;
  if (user.profileImg !== undefined) row.profile_img = user.profileImg;
  if (user.profileImgPath !== undefined) row.profile_img_path = user.profileImgPath;
  return row;
}

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
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: user.email || '',
          nickname: user.nickname,
          password: user.password || '',
          username: user.username,
          profile_img: user.profileImg,
          profile_img_path: user.profileImgPath,
        })
        .select()
        .single();

      return toUser(assertSupabaseData<UserRow>(data, error));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('사용자 생성에 실패했습니다.');
    }
  }

  async createUserReview(
    reviewContent: string,
    routineCompletionId: number,
    userId: string
  ): Promise<UserReviewEntity | undefined> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          review_content: reviewContent,
          routine_completion_id: routineCompletionId,
          user_id: userId,
        })
        .select()
        .single();

      const row = assertSupabaseData<ReviewRow>(data, error);
      return new UserReviewEntity(
        row.id,
        row.review_content,
        new Date(row.created_at),
        row.routine_completion_id,
        row.user_id
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findByUserChallengesAndRoutinesAndFollowAndCompletion(nickname: string, userId: string) {
    try {
      const supabase = getSupabaseAdmin();

      const { data: user, error: userError } = await supabase
        .from('users')
        .select(
          `
          id,
          nickname,
          username,
          profile_img,
          profile_img_path,
          challenges (
            id,
            name,
            created_at,
            end_at,
            active,
            routines (
              id,
              routine_title,
              emoji,
              created_at,
              routines_completions (
                id,
                created_at,
                user_id
              )
            )
          )
        `
        )
        .eq('nickname', nickname)
        .maybeSingle();

      if (userError) throw new Error(userError.message);
      if (!user) return null;

      const typedUser = user as UserWithChallengesRow;

      const [
        { data: following, error: followingError },
        { data: followers, error: followersError },
      ] = await Promise.all([
        supabase.from('follows').select('to_user_id').eq('from_user_id', typedUser.id),
        supabase.from('follows').select('from_user_id').eq('to_user_id', typedUser.id),
      ]);

      if (followingError) throw new Error(followingError.message);
      if (followersError) throw new Error(followersError.message);

      return {
        id: typedUser.id,
        nickname: typedUser.nickname,
        username: typedUser.username,
        profileImg: typedUser.profile_img,
        profileImgPath: typedUser.profile_img_path,
        challenges: (typedUser.challenges ?? []).map(challenge => ({
          id: challenge.id,
          name: challenge.name,
          createdAt: new Date(challenge.created_at),
          endAt: new Date(challenge.end_at),
          active: challenge.active,
          routines: (challenge.routines ?? []).map(routine => ({
            id: routine.id,
            routineTitle: routine.routine_title,
            emoji: routine.emoji,
            createdAt: new Date(routine.created_at),
            completions: (routine.routines_completions ?? [])
              .filter(completion => completion.user_id === userId)
              .map(completion => ({
                id: completion.id,
                createdAt: new Date(completion.created_at),
              })),
          })),
        })),
        following: (following ?? []).map(link => ({ toUserId: link.to_user_id })),
        followers: (followers ?? []).map(link => ({ fromUserId: link.from_user_id })),
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findByUserNicknameRoutineCompletion(
    nickname: string,
    page: number,
    pageSize: number,
    categoryId: string
  ): Promise<RoutineCompletion[] | undefined> {
    try {
      const supabase = getSupabaseAdmin();

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('nickname', nickname)
        .maybeSingle();

      if (userError) throw new Error(userError.message);
      if (!user) return [];

      let challengesQuery = supabase.from('challenges').select('id').eq('user_id', user.id);
      if (categoryId !== 'All') {
        challengesQuery = challengesQuery.eq('category_id', Number(categoryId));
      }

      const { data: challenges, error: challengesError } = await challengesQuery;
      if (challengesError) throw new Error(challengesError.message);
      if (!challenges?.length) return [];

      const challengeIds = challenges.map(challenge => challenge.id);

      const { data: routines, error: routinesError } = await supabase
        .from('routines')
        .select('id')
        .in('challenge_id', challengeIds);

      if (routinesError) throw new Error(routinesError.message);
      if (!routines?.length) return [];

      const routineIds = routines.map(routine => routine.id);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data: completions, error: completionsError } = await supabase
        .from('routines_completions')
        .select('*')
        .in('routine_id', routineIds)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (completionsError) throw new Error(completionsError.message);

      return (completions ?? []).map(row => toRoutineCompletion(row as CompletionRow));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findAll(username: string = '', myNickName: string): Promise<User[] | undefined> {
    try {
      const supabase = getSupabaseAdmin();
      let query = supabase.from('users').select().neq('nickname', myNickName);

      if (username) {
        query = query.ilike('username', `%${username}%`);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      return (data ?? []).map(row => toUser(row as UserRow));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      return toUser(data as UserRow);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('이메일로 사용자를 찾는 중 오류가 발생했습니다.');
    }
  }

  async findUserRoutineCompletionReview(
    routineCompletionId: number
  ): Promise<UserReviewEntity[] | undefined> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('reviews')
        .select(
          `
          id,
          review_content,
          created_at,
          routine_completion_id,
          user_id,
          users (
            username,
            nickname
          )
        `
        )
        .eq('routine_completion_id', routineCompletionId);

      if (error) throw new Error(error.message);

      return (data ?? []).map(row => {
        const review = row as ReviewRow & {
          users: ReviewUserRow | ReviewUserRow[] | null;
        };
        const reviewUser = resolveReviewUser(review.users);
        const entity = new UserReviewEntity(
          review.id,
          review.review_content,
          new Date(review.created_at),
          review.routine_completion_id,
          review.user_id
        );
        return Object.assign(entity, {
          User: reviewUser
            ? { username: reviewUser.username, nickname: reviewUser.nickname }
            : null,
        }) as UserReviewEntity;
      });
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return !!data;
    } catch (error) {
      console.error('이메일 존재 여부 확인 중 오류:', error);
      throw error;
    }
  }

  async findByNickname(nickname: string): Promise<User | null> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('nickname', nickname)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      return toUser(data as UserRow);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('users').select().eq('id', id).maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      const row = data as UserRow;
      return new User(row.username, row.nickname, row.profile_img, row.id);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return null;
    }
  }

  async update(
    user: Partial<User>,
    beforeNickname?: string
  ): Promise<User | { message: string } | undefined> {
    try {
      const nickname = beforeNickname ?? user.nickname ?? '';
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('users')
        .update(toUserUpdateRow(user))
        .eq('nickname', nickname)
        .select()
        .single();

      if (isUniqueViolation(error)) {
        return { message: '해당 닉네임은 이미 사용 중입니다.' };
      }

      return toUser(assertSupabaseData<UserRow>(data, error));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async updateUserName(id: string, username: string): Promise<User | undefined> {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('users')
        .update({ username, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return toUser(assertSupabaseData<UserRow>(data, error));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return undefined;
    }
  }

  async delete(nickname: string): Promise<boolean> {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('users').delete().eq('nickname', nickname);

      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      return false;
    }
  }

  async deleteUserRoutineCompletionReview(
    reviewContent: string,
    routineCompletionId: number,
    userId: string
  ): Promise<boolean | undefined> {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('review_content', reviewContent)
        .eq('routine_completion_id', routineCompletionId)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}
