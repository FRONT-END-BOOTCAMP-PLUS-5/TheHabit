export interface FollowingDto{
    readonly id: string,
    readonly nickname: string,
    readonly username: string,
    readonly profileImg: string | null,
    readonly profileImgPath: string | null,
    readonly following: {
        toUser: {
            id: string;
            nickname: string;
            username: string;
            profileImg: string | null;
            isFollowing?: boolean;
        };
    }[],
    readonly password?: string,
    readonly email?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date,
}