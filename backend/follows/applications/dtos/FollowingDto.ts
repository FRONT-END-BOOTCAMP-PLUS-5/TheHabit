export class FollowingDto {
    constructor(
        public readonly id: string,
        public readonly nickname: string,
        public readonly username: string,
        public readonly profileImg: string | null,
        public readonly following: {
            toUser: {
                id: string;
                nickname: string;
                username: string;
                profileImg: string | null;
                isFollowing?: boolean;
            };
        }[],
        public readonly password?: string,
        public readonly email?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) { }
}
