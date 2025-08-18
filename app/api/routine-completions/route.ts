import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { AddRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/AddRoutineCompletionUseCase';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { GetRoutinesUseCase } from '@/backend/routines/applications/usecases/GetRoutinesUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { PrRoutinesRepository } from '@/backend/routines/infrastructures/repositories/PrRoutinesRepository';
import { s3Service } from '@/backend/shared/services/s3.service';

const routineCompletionsRepository = new PrRoutineCompletionsRepository();
const routinesRepository = new PrRoutinesRepository();

// 루틴 완료 생성 (POST) - 이미지 업로드 포함
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== POST /api/routine-completions 요청 시작 ===');

    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증이 필요합니다.',
          },
        },
        { status: 401 }
      );
    }

    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file');
    const routineIdValue = formData.get('routineId');
    const reviewValue = formData.get('review');

    console.log('요청 데이터:', { 
      hasFile: !!file,
      routineId: routineIdValue,
      review: reviewValue 
    });

    // 필수 필드 검증
    if (!routineIdValue) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ROUTINE_ID',
            message: '루틴 ID가 필요합니다.',
          },
        },
        { status: 400 }
      );
    }

    if (!reviewValue || typeof reviewValue !== 'string' || reviewValue.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_REVIEW',
            message: '리뷰 내용이 필요합니다.',
          },
        },
        { status: 400 }
      );
    }

    // 루틴 ID 검증
    const routineIdNumber = Number(routineIdValue);
    if (isNaN(routineIdNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ROUTINE_ID',
            message: '올바른 루틴 ID가 필요합니다.',
          },
        },
        { status: 400 }
      );
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
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'IMAGE_UPLOAD_FAILED',
              message: '이미지 업로드에 실패했습니다.',
            },
          },
          { status: 500 }
        );
      }
    }

    // 루틴 완료 데이터 생성
    const addRoutineCompletionUseCase = new AddRoutineCompletionUseCase(
      routineCompletionsRepository
    );

    const result = await addRoutineCompletionUseCase.execute({
      userId: session.user.id,
      routineId: routineIdNumber,
      review: reviewValue.trim(),
      proofImgUrl,
    });

    console.log('루틴 완료 생성 성공:', result);
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('루틴 완료 생성 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATION_FAILED',
          message: '루틴 완료 생성에 실패했습니다.',
        },
      },
      { status: 500 }
    );
  }
}

// 루틴 완료 목록 조회 (GET)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');

    // 필수 파라미터 검증
    if (!challengeId) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다: challengeId' },
        { status: 400 }
      );
    }

    const challengeIdNumber = Number(challengeId);
    if (isNaN(challengeIdNumber)) {
      return NextResponse.json(
        { error: '올바른 챌린지 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const getRoutinesUseCase = new GetRoutinesUseCase(routinesRepository);
    const getRoutineCompletionsUseCase = new GetRoutineCompletionsUseCase(
      routineCompletionsRepository
    );

    // 1. 해당 챌린지의 루틴 목록 조회
    const routines = await getRoutinesUseCase.getByChallengeId(challengeIdNumber);

    // 2. 각 루틴에 대한 사용자의 완료 상태 조회 (병렬 처리로 성능 개선)
    const completionPromises = routines.map(routine =>
      getRoutineCompletionsUseCase.getByUserAndRoutine(session.user.id, routine.id)
    );

    const completionResults = await Promise.all(completionPromises);
    const completions = completionResults.flat();

    return NextResponse.json(completions);
  } catch (error) {
    console.error('루틴 완료 목록 조회 오류:', error);
    return NextResponse.json({ error: '루틴 완료 목록 조회에 실패했습니다.' }, { status: 500 });
  }
}