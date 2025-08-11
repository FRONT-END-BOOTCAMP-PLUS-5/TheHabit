import { SignUpRequestDto } from "@/backend/auths/applications/dtos/SignUpRequestDto";
import { SignUpResponseDto } from "@/backend/auths/applications/dtos/SignUpResponseDto";
import { IUserRepository } from "@/backend/users/domains/repositories/IUserRepository";

export class CreateUserUsecase {
    constructor(private readonly userRepository: IUserRepository) {}

    async signUp(signUpRequest: SignUpRequestDto): Promise<SignUpResponseDto> {
        try {
            // TODO: 1. 입력 검증 로직 추가
            
            // TODO: 2. 이메일 중복 확인 로직 추가
            
            // TODO: 3. 사용자 생성 로직 추가
            
            // TODO: 4. 성공 응답 로직 추가
            
        } catch (error) {
            // TODO: 5. 에러 처리 로직 추가
        }
    }
}