// backend/users/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CreateUserUsecase } from '@/backend/auths/applications/usecases/CreateUserUsecase';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';

const userRepository = new PrUserRepository();

export async function POST(request: NextRequest) {
  try {
    // FormData 처리
    console.log('🚀 [Signup API] 회원가입 요청 시작');
    
    const formData = await request.formData();
     console.log('📋 [Signup API] FormData 키들:', Array.from(formData.keys()));
    
    // 1. 요청 데이터 파싱
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    const nickname = formData.get('nickname') as string;
    const profileFile = formData.get('profileImage') as File | null;

    // 2. DTO로 데이터 변환 및 검증
    const signUpData = {
      email,
      password,
      username,
      nickname,
      profileImg: null, // 초기값은 null
      profileImgPath: null, // 초기값은 null
      profileFile, // 파일 객체 추가
    };

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