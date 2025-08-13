import { LoginRequestDto } from "@/backend/auths/applications/dtos/LoginRequestDto";
import { LoginResponseDto } from "@/backend/auths/applications/dtos/LoginResponseDto";
import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";
import bcrypt from "bcryptjs";


export class LoginUsecase {
    constructor(private readonly userRepository: IUserRepository) {
        // console.log("🔧 [LoginUsecase] 인스턴스 생성됨");
    }

    async execute(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
        // console.log("🚀 [LoginUsecase] 로그인 프로세스 시작");
        // console.log("📝 [LoginUsecase] 입력된 로그인 요청:", {
        //     email: loginRequest.email,
        //     password: loginRequest.password ? "***" : "undefined"
        // });

        try {
            // 입력 검증
            // console.log("🔍 [LoginUsecase] 1단계: 입력값 검증 시작");
            if (!loginRequest.email || !loginRequest.password) {
                // console.log("❌ [LoginUsecase] 입력값 검증 실패: 이메일 또는 비밀번호 누락");
                return {
                    success: false,
                    message: "이메일과 비밀번호를 모두 입력해주세요."
                };
            }
            // console.log("✅ [LoginUsecase] 입력값 검증 통과");

            // 이메일 형식 검증
            // console.log("🔍 [LoginUsecase] 2단계: 이메일 형식 검증 시작");
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isEmailValid = emailRegex.test(loginRequest.email);

            if (!isEmailValid) {
                // console.log("❌ [LoginUsecase] 이메일 형식 검증 실패:", loginRequest.email);
                return {
                    success: false,
                    message: "올바른 이메일 형식을 입력해주세요."
                };
            }
            // console.log("✅ [LoginUsecase] 이메일 형식 검증 통과:", loginRequest.email);

            // 사용자 조회
            // console.log("🔍 [LoginUsecase] 3단계: 사용자 조회 시작");
            const user = await this.userRepository.findByEmail(loginRequest.email);
            // console.log("📊 [LoginUsecase] 사용자 조회 결과:", {
            //     found: !!user,
            //     userId: user?.id,
            //     userEmail: user?.email
            // });

            if (!user.id) {
                // console.log("❌ [LoginUsecase] 사용자 조회 실패: 유효하지 않은 사용자 ID");
                return {
                    success: false,
                    message: "사용자 ID가 유효하지 않습니다."
                };
            }
            // console.log("✅ [LoginUsecase] 사용자 조회 성공:", {
            //     id: user.id,
            //     email: user.email
            // });

            // 비밀번호 검증
            // console.log("🔍 [LoginUsecase] 4단계: 비밀번호 검증 시작");
            // console.log("🔐 [LoginUsecase] 비밀번호 비교:", {
            //     inputPassword: loginRequest.password ? "***" : "undefined",
            //     storedPassword: user.password ? "***" : "undefined"
            // });

            const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password || "");

            if (!isPasswordValid) {
                // console.log("❌ [LoginUsecase] 비밀번호 검증 실패: 비밀번호 불일치");
                return {
                    success: false,
                    message: "비밀번호가 일치하지 않습니다."
                };
            }
            // console.log("✅ [LoginUsecase] 비밀번호 검증 성공");

            // 로그인 성공 응답 생성
            // console.log("🎉 [LoginUsecase] 5단계: 로그인 성공 응답 생성");
            const successResponse = {
                success: true,
                message: "로그인 성공",
                user: {
                    id: user.id,
                    email: user.email || "",
                    username: user.username,
                    nickname: user.nickname,
                    profileImg: user.profileImg,
                }
            };

            // console.log("✅ [LoginUsecase] 로그인 프로세스 완료:", {
            //     success: successResponse.success,
            //     userId: successResponse.user.id,
            //     userEmail: successResponse.user.email
            // });

            return successResponse;

        } catch (error) {
            // console.error("💥 [LoginUsecase] 로그인 처리 중 오류 발생:", error);

            if (error instanceof Error) {
                throw new Error(error.message);
            }

            throw new Error("로그인 처리 중 알 수 없는 오류가 발생했습니다.");
        }
    }
}
