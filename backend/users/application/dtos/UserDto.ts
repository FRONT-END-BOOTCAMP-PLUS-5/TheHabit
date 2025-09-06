export interface UserDto {
  readonly username: string;
  readonly nickname: string;
  readonly profileImg: string | null;
  readonly profileImgPath: string | null;
  readonly id?: string;
  readonly password?: string;
  readonly email?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface newUserDto extends UserDto {
  isFollowing: boolean;
}
