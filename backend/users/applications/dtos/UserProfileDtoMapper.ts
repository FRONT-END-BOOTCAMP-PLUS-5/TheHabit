import { User } from '@/backend/users/domains/entities/UserEntity';
import { UserProfileDto } from './UserProfileDto';

export class UserProfileDtoMapper {
  static fromEntity(entity: User): UserProfileDto {
    return {
      username: entity.username,
      nickname: entity.nickname,
      profileImg: entity.profileImg || null,
    };
  }
}
