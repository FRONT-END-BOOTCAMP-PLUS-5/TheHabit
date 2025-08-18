import { NextRequest, NextResponse } from 'next/server';
import { AddRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/AddRoutineCompletionUseCase';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { GetRoutinesUseCase } from '@/backend/routines/applications/usecases/GetRoutinesUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { PrRoutinesRepository } from '@/backend/routines/infrastructures/repositories/PrRoutinesRepository';
import { PrUserRepository } from '@/backend/users/infrastructures/repositories/PrUserRepository';
import { s3Service } from '@/backend/shared/services/s3.service';
import { RoutineCompletionDto } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

const routineCompletionsRepository = new PrRoutineCompletionsRepository();
const routinesRepository = new PrRoutinesRepository();
const userRepository = new PrUserRepository();

// 루틴 완료 생성 (POST) - 이미지 업로드 포함
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<RoutineCompletionDto | null>>> {
  try {
    console.log('=== POST /api/routine-completions 요청 시작 ===');

    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file');
    const routineIdValue = formData.get('routineId');
    const contentValue = formData.get('content');
    const nicknameValue = formData.get('nickname');

    console.log('요청 데이터:', {
      hasFile: !!file,
      routineId: routineIdValue,
      content: contentValue,
      nickname: nicknameValue,
    });

    // 필수 필드 검증
    if (!nicknameValue || typeof nicknameValue !== 'string' || nicknameValue.trim() === '') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_NICKNAME',
          message: '닉네임이 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!routineIdValue) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_ROUTINE_ID',
          message: '루틴 ID가 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!contentValue || typeof contentValue !== 'string' || contentValue.trim() === '') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_CONTENT',
          message: '콘텐츠 내용이 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 루틴 ID 검증
    const routineIdNumber = Number(routineIdValue);
    if (isNaN(routineIdNumber)) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_ROUTINE_ID',
          message: '올바른 루틴 ID가 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 이미지 업로드 처리 (선택사항)
    let proofImgUrl: string | null = null;
    if (file && file instanceof File) {
      try {
        const uploadResult = await s3Service.uploadImage(file, 'routine-completions');
        proofImgUrl = uploadResult.imageUrl;
        console.log('이미지 업로드 성공:', proofImgUrl);
      } catch (uploadError) {
        console.error('이미지 업로드 실패:', uploadError);
        const errorResponse: ApiResponse<null> = {
          success: false,
          error: {
            code: 'IMAGE_UPLOAD_FAILED',
            message: '이미지 업로드에 실패했습니다.'
          }
        };
        return NextResponse.json(errorResponse, { status: 500 });
      }
    }

    // 루틴 완료 데이터 생성
    const addRoutineCompletionUseCase = new AddRoutineCompletionUseCase(
      routineCompletionsRepository
    );

    const result = await addRoutineCompletionUseCase.executeByNickname({
      nickname: nicknameValue.trim(),
      routineId: routineIdNumber,
      content: contentValue.trim(),
      proofImgUrl,
    });

    console.log('루틴 완료 생성 성공:', result);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('루틴 완료 생성 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'CREATION_FAILED',
        message: '루틴 완료 생성에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 루틴 완료 목록 조회 (GET)
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<RoutineCompletionDto[] | null>>> {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');
    const nickname = searchParams.get('nickname');

    // 필수 파라미터 검증
    if (!nickname) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_NICKNAME',
          message: '닉네임이 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!challengeId) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_CHALLENGE_ID',
          message: '챌린지 ID가 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const challengeIdNumber = Number(challengeId);
    if (isNaN(challengeIdNumber)) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_CHALLENGE_ID',
          message: '올바른 챌린지 ID가 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const getRoutinesUseCase = new GetRoutinesUseCase(routinesRepository);
    const getRoutineCompletionsUseCase = new GetRoutineCompletionsUseCase(
      routineCompletionsRepository,
      userRepository as any
    );

    // 1. 해당 챌린지의 루틴 목록 조회
    const routines = await getRoutinesUseCase.getByChallengeId(challengeIdNumber);

    // 2. 각 루틴에 대한 사용자의 완료 상태 조회 (병렬 처리로 성능 개선)
    const completionPromises = routines.map(routine =>
      getRoutineCompletionsUseCase.getByNicknameAndRoutine(nickname, routine.id)
    );

    const completionResults = await Promise.all(completionPromises);
    const completions = completionResults.flat();

    return NextResponse.json({ success: true, data: completions });
  } catch (error) {
    console.error('루틴 완료 목록 조회 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: '루틴 완료 목록 조회에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
