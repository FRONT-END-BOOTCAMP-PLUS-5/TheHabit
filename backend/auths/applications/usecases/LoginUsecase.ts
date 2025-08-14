import { LoginRequestDto } from '@/backend/auths/applications/dtos/LoginRequestDto';
import { LoginResponseDto } from '@/backend/auths/applications/dtos/LoginResponseDto';
import { IUserRepository } from '@/backend/users/domains/repositories/IUserRepository';
import bcrypt from 'bcryptjs';

export class LoginUsecase {
    constructor(private readonly userRepository: IUserRepository) {
        // console.log("🔧 [LoginUsecase] 인스턴스 생성됨");
    }

    async execute(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
        console.log('🚀 LoginUsecase.execute 시작');
        console.log('📝 입력된 로그인 요청:', loginRequest);

        try {
            // 입력 검증
            if (!loginRequest.email || !loginRequest.password) {
                console.log('❌ 입력 검증 실패: 이메일 또는 비밀번호가 입력되지 않았습니다.');
                return {
                    success: false,
                    message: '이메일과 비밀번호를 모두 입력해주세요.',
                };
            }
            // console.log("✅ [LoginUsecase] 입력값 검증 통과");

            // 이메일 형식 검증
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isEmailValid = emailRegex.test(loginRequest.email);

            if (!isEmailValid) {
                return {
                    success: false,
                    message: '올바른 이메일 형식을 입력해주세요.',
                };
            }

            // 사용자 조회
            const user = await this.userRepository.findByEmail(loginRequest.email);

            if (!user.id) {
                return {
                    success: false,
                    message: '사용자 ID가 유효하지 않습니다.',
                };
            }

            // 비밀번호 검증
            const isPasswordValid = loginRequest.password === user.password;

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: '비밀번호가 일치하지 않습니다.',
                };
            }

            console.log('✅ 비밀번호 검증 성공');

            // 5. 성공 응답
            console.log('🎉 5단계: 로그인 성공 응답 생성');

            const successResponse = {
                success: true,
                message: '로그인 성공',
                user: {
                    id: user.id,
                    email: user.email || '',
                    username: user.username,
                    nickname: user.nickname,
                    profileImg: user.profileImg,
                },
            };

            return successResponse;
        } catch (error) {
            // console.error("💥 [LoginUsecase] 로그인 처리 중 오류 발생:", error);

            if (error instanceof Error) {
                throw new Error(error.message);
            }

            throw new Error('로그인 처리 중 알 수 없는 오류가 발생했습니다.');
        }
    }
}
