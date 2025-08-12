import { LoginRequestDto } from "@/backend/auths/applications/dtos/LoginRequestDto";
import { LoginResponseDto } from "@/backend/auths/applications/dtos/LoginResponseDto";
import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";
// import bcrypt from "bcryptjs";

export class LoginUsecase {
    constructor(private readonly userRepository: IUserRepository) {
    }

    async execute(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
        console.log("🚀 LoginUsecase.execute 시작");
        console.log("📝 입력된 로그인 요청:", loginRequest);
        
        try {
            // 1. 입력 검증(이메일 비밀번호 둘 다 입력되었는지)
            console.log("🔍 1단계: 입력 검증 시작");
            if (!loginRequest.email || !loginRequest.password) {
                console.log("❌ 입력 검증 실패: 이메일 또는 비밀번호가 입력되지 않았습니다.");
                console.log("📧 이메일:", loginRequest.email);
                console.log("🔑 비밀번호:", loginRequest.password);
                return {
                    success: false,
                    message: "이메일과 비밀번호를 모두 입력해주세요."
                };
            } else {
                console.log("✅ 입력 검증 통과: 이메일과 비밀번호가 모두 입력되었습니다.");
            }

            // 2. 이메일 형식 검증(이메일 형식이 맞는지)
            console.log("🔍 2단계: 이메일 형식 검증 시작");
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isEmailValid = emailRegex.test(loginRequest.email);
            console.log("📧 이메일 형식 검증 결과:", isEmailValid);
            
            if (!isEmailValid) {
                console.log("❌ 이메일 형식 검증 실패");
                return {
                    success: false,
                    message: "올바른 이메일 형식을 입력해주세요."
                };
            }
            console.log("✅ 이메일 형식 검증 통과");

            // 3. 사용자 조회 (이메일로 찾기)
            console.log("🔍 3단계: 사용자 조회 시작");
            console.log("🔍 조회할 이메일:", loginRequest.email);
            
            const user = await this.userRepository.findByEmail(loginRequest.email);
            console.log("👤 사용자 조회 결과:", user);
            
            if (!user) {
                console.log("❌ 사용자 조회 실패: 존재하지 않는 이메일");
                return {
                    success: false,
                    message: "존재하지 않는 이메일입니다."
                };
            }
            console.log("✅ 사용자 조회 성공");
            console.log("👤 사용자 정보:", {
                id: user.id,
                email: user.email,
                username: user.username,
                nickname: user.nickname,
                hasPassword: !!user.password
            });

            // 4. 비밀번호 검증(비밀번호가 일치하는지)
            console.log("🔍 4단계: 비밀번호 검증 시작");
            console.log("🔑 입력된 비밀번호:", loginRequest.password);
            console.log("🔑 저장된 비밀번호:", user.password);
            
            // const isPasswordValid = await bcrypt.compare(
            //     loginRequest.password,
            //     user.password || ""
            // );

            // if (!isPasswordValid) {
            //     return {
            //         success: false,
            //         message: "비밀번호가 일치하지 않습니다."
            //     };
            // }
            const isPasswordValid = loginRequest.password === user.password;
            console.log("🔑 비밀번호 일치 여부:", isPasswordValid);

            if (!isPasswordValid) {
                console.log("❌ 비밀번호 검증 실패");
                return {
                    success: false,
                    message: "비밀번호가 일치하지 않습니다."
                };
            }
            console.log("✅ 비밀번호 검증 성공");

            // 5. 성공 응답
            console.log("🎉 5단계: 로그인 성공 응답 생성");
            const successResponse = {
                success: true,
                message: "로그인 성공",
                user: {
                    id: user.id || "",
                    email: user.email || "",
                }
            };
            console.log("✅ 최종 응답:", successResponse);
            return successResponse;

        } catch (error) {
            console.error("💥 LoginUsecase 실행 중 오류:", error);
            return {
                success: false,
                message: "로그인 처리 중 오류가 발생했습니다."
            };
        }
    }
}
