import { User } from "@/backend/users/domains/entities/UserEntity";
import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";
import { ILoginRepository } from "@/backend/auths/domains/repositories/ILoginRepository";
import bcrypt from "bcryptjs";
import prisma from "@/public/utils/prismaClient";

export class PrLoginRepository implements ILoginRepository {
    constructor(private readonly userRepository: IUserRepository) {}

    // 이메일로 사용자 조회
   async findUserByEmail(email: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });
        
        if (!user) return null;
        
        return new User(
            user.username,
            user.nickname,
            user.profileImg,
            user.id,
            user.password,
            user.email
        );
    } catch (error) {
        console.error("사용자 조회 중 오류:", error);
        return null;
    }
}

    // 비밀번호 검증
    async validatePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            // bcrypt를 사용하여 비밀번호 검증
            return await bcrypt.compare(inputPassword, hashedPassword);
        } catch (error) {
            console.error("비밀번호 검증 중 오류:", error);
            return false;
        }
    }
}
