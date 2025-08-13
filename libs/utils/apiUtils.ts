import { NextResponse } from 'next/server';

// API 에러 응답 생성 유틸리티
export const createErrorResponse = (message: string, status: number = 500) => {
  return NextResponse.json({ error: message }, { status });
};

// API 성공 응답 생성 유틸리티
export const createSuccessResponse = (data: any, status: number = 200) => {
  return NextResponse.json(data, { status });
};

// 요청 파라미터 검증 유틸리티
export const validateRequiredParams = (
  params: Record<string, any>,
  requiredFields: string[],
) => {
  const missingFields = requiredFields.filter((field) => !params[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `필수 파라미터가 누락되었습니다: ${missingFields.join(', ')}`,
    };
  }

  return { isValid: true };
};

// 임시 사용자 ID (추후 인증 시스템에서 가져오도록 수정 예정)
export const TEMP_USER_ID = 'f1c6b5ae-b27e-4ae3-9e30-0cb8653b04fd';
