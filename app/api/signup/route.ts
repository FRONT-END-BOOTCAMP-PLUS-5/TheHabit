// backend/users/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CreateUserUsecase } from '@/backend/auths/applications/usecases/CreateUserUsecase';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';

const userRepository = new PrUserRepository();

export async function POST(request: NextRequest) {
  try {
    // 1. 요청 데이터 파싱
    const body = await request.json();
    
    // 2. DTO로 데이터 변환 및 검증
      const signUpData = {
        email: body.email,
        password: body.password,
        username: body.username,
        nickname: body.nickname,
<<<<<<< HEAD
<<<<<<< HEAD
        profileImage: body.profileImage,
        profileImagePath: body.profileImagePath,
=======
>>>>>>> 3774aacf0fc1c0dd1a5cf1b67bad11d5e008a55b
=======
>>>>>>> d8a4760c455f02db7f4debdd45e8a7fe789e418c
      }
      // 3. UseCase 실행
    const createUserUsecase = new CreateUserUsecase(userRepository);
    const result = await createUserUsecase.signUp(signUpData); 
    
    // 4. 성공 응답 반환
    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.', user: result },
      { status: 201 }
    );
    
  } catch (error) {
    // 5. 에러 처리
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' },
      { status: 400 }
    );
  }
}