import { SignUpRequestDto } from "@/backend/auths/applications/dtos/SignUpRequestDto";
import { SignUpResponseDto } from "@/backend/auths/applications/dtos/SignUpResponseDto";
import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";
import bcrypt from "bcryptjs";

export class CreateUserUsecase {
    constructor(private readonly userRepository: IUserRepository) {}

    async signUp(signUpRequest: SignUpRequestDto): Promise<SignUpResponseDto> {
        try {
            const { email, password, username, nickname } = signUpRequest;
            // 필수 입력란 검증
            if (!email || !password || !username || !nickname) {
                throw new Error("필수 입력값입니다.");
            }
            // 이메일 중복 확인
            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error("이미 존재하는 이메일입니다.");
            }

            // 비밀번호 해싱
            const hashedPassword = await bcrypt.hash(password, 10);

            // 사용자 생성
            const user = await this.userRepository.create({
                email,
                password: hashedPassword,
                username,
                nickname,
                profileImg: null,
            });

            // 성공 응답
            return {
                success: true,
                message: "회원가입이 성공적으로 완료되었습니다.",
                user: {
                    id: user?.id ?? "",
                    email: user?.email ?? "",
                    username: user?.username ?? "",
                    nickname: user?.nickname ?? "",
                    profileImg: user?.profileImg ?? null,   
                },
            };
        } catch (error) {
            throw error;
        }
    }
}