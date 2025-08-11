export interface FollowerDto{
    readonly id: string,
    readonly nickname: string,
    readonly username: string,
    readonly profileImg: string | null,
    readonly followers: {
        fromUser: {
            id: string;
            username: string;
            nickname: string;
            profileImg: string | null;
            isFollowing?: boolean;
        }
    }[],
    readonly password?: string,
    readonly email?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date,
}