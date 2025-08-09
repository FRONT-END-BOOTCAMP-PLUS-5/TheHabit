export interface LoginResponseDto {
    readonly success: boolean; // 로그인 성공 여부
    readonly message?: string; // 로그인 실패 시 에러 메시지
    readonly user?: {
        readonly id: string; // 사용자 고유 ID
        readonly email: string; // 사용자 이메일
        // readonly name?: string; // 사용자 이름
        // readonly profileImage?: string; // 사용자 프로필 이미지
        // readonly createdAt: Date; // 사용자 생성 일시
        // readonly updatedAt: Date; // 사용자 수정 일시
    };
}