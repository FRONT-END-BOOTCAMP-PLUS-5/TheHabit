import { LoginRequestDto } from "../dtos/LoginRequestDto";
import { LoginResponseDto } from "../dtos/LoginResponseDto";
import { ILoginRepository } from "@/backend/auths/domains/repositories/ILoginRepository";
import { PrLoginRepository } from "@/backend/auths/domains/repositories/PrLoginRepository";
import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";

export class LoginUsecase {
    private readonly loginRepository: ILoginRepository;

    constructor(private readonly userRepository: IUserRepository) {
        this.loginRepository = new PrLoginRepository(userRepository);
    }

    async execute(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
        try {
            // 1. 입력 검증(이메일 비밀번호 둘 다 입력되었는지)
            if (!loginRequest.email || !loginRequest.password) {
                console.log("입력 검증 실패: 이메일 또는 비밀번호가 입력되지 않았습니다.");
                return {
                    success: false,
                    message: "이메일과 비밀번호를 모두 입력해주세요."
                };
            } else {
                console.log("입력 검증 통과: 이메일과 비밀번호가 모두 입력되었습니다.");
            }

            // 2. 이메일 형식 검증(이메일 형식이 맞는지)
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(loginRequest.email)) {
                return {
                    success: false,
                    message: "올바른 이메일 형식을 입력해주세요."
                };
            }

            // 3. 사용자 조회 (이메일로 찾기)
            const user = await this.loginRepository.findUserByEmail(loginRequest.email);
            if (!user) {
                return {
                    success: false,
                    message: "존재하지 않는 이메일입니다."
                };
            }

            // 4. 비밀번호 검증(비밀번호가 일치하는지)
            const isPasswordValid = await this.loginRepository.validatePassword(
                loginRequest.password,
                user.password || ""
            );

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "비밀번호가 일치하지 않습니다."
                };
            }

            // 5. 성공 응답
            return {
                success: true,
                message: "로그인 성공",
                user: {
                    id: user.id || "",
                    email: user.email || "",
                    // name: user.nickname,
                    // profileImage: user.profileImg || undefined
                }
            };

        } catch (error) {
            console.error("LoginUsecase 실행 중 오류:", error);
            return {
                success: false,
                message: "로그인 처리 중 오류가 발생했습니다."
            };
        }
    }
}
