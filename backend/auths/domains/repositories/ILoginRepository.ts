import { User } from "@/backend/users/domains/entities/UserEntity";

export interface ILoginRepository {
    findUserByEmail(email: string): Promise<User | null>;
    validatePassword(inputPassword: string, hashedPassword: string): Promise<boolean>;
}
