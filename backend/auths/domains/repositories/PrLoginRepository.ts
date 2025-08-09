import { User } from "@/backend/users/domains/entities/UserEntity";
import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";
import { ILoginRepository } from "./ILoginRepository";
import bcrypt from "bcryptjs";

export class PrLoginRepository implements ILoginRepository {
    constructor(private readonly userRepository: IUserRepository) {}

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            // 현재 IUserRepository에는 이메일로 찾는 메서드가 없으므로
            // 모든 사용자를 가져와서 필터링하는 방식으로 구현
            const allUsers = await this.userRepository.findAll();
            if (!allUsers) return null;
            
            return allUsers.find(user => user.email === email) || null;
        } catch (error) {
            console.error("사용자 조회 중 오류:", error);
            return null;
        }
    }

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
