export class FollowerDto {
    constructor(
        public readonly id: string,
        public readonly nickname: string,
        public readonly username: string,
        public readonly profileImg: string | null,
        public readonly followers: {
            fromUser: {
                id: string
                username: string
                nickname: string
                profileImg: string | null
            }
        }[],
        public readonly password?: string,
        public readonly email?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) { }
}