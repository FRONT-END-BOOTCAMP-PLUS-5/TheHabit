import { NextRequest, NextResponse } from 'next/server';
import { AddRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/AddRoutineCompletionUseCase';
import { UpdateRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/UpdateRoutineCompletionUseCase';
import { DeleteRoutineCompletionUseCase } from '@/backend/routine-completions/applications/usecases/DeleteRoutineCompletionUseCase';
import { GetRoutineCompletionsUseCase } from '@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase';
import { PrRoutineCompletionsRepository } from '@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository';
import { s3Service } from '@/backend/shared/services/s3.service';
import { RoutineCompletionDto, RoutineCompletionDtoMapper } from '@/backend/routine-completions/applications/dtos/RoutineCompletionDto';
import { ApiResponse } from '@/backend/shared/types/ApiResponse';

const createAddRoutineCompletionUseCase = () => {
  const repository = new PrRoutineCompletionsRepository();
  return new AddRoutineCompletionUseCase(repository);
};

const createUpdateRoutineCompletionUseCase = () => {
  const repository = new PrRoutineCompletionsRepository();
  return new UpdateRoutineCompletionUseCase(repository);
};

const createDeleteRoutineCompletionUseCase = () => {
  const repository = new PrRoutineCompletionsRepository();
  return new DeleteRoutineCompletionUseCase(repository);
};

const createGetRoutineCompletionsUseCase = () => {
  const repository = new PrRoutineCompletionsRepository();
  return new GetRoutineCompletionsUseCase(repository);
};

// 루틴 완료 조회 (GET)
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<RoutineCompletionDto[] | null>>> {
  try {
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get('nickname');

    // nickname이 제공되지 않은 경우
    if (!nickname || nickname.trim() === '') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_NICKNAME',
          message: '닉네임이 제공되지 않았습니다.',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const getRoutineCompletionsUseCase = createGetRoutineCompletionsUseCase();

    // 해당 닉네임의 모든 루틴 완료 조회
    const completions = await getRoutineCompletionsUseCase.getByNickname(nickname.trim());

    const successResponse: ApiResponse<RoutineCompletionDto[]> = {
      success: true,
      data: completions,
      message: '루틴 완료 목록을 성공적으로 조회했습니다.',
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 완료 목록 조회 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: '루틴 완료 목록 조회에 실패했습니다.',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 루틴 완료 생성 (POST)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Content-Type 확인
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);

    // FormData 파싱 시도
    let formData;
    try {
      // request.clone() 없이 직접 파싱
      formData = await request.formData();
      console.log('FormData 파싱 성공');
    } catch (formDataError) {
      console.error('FormData 파싱 실패:', formDataError);
      console.error('Content-Type:', contentType);
      console.error('Headers:', Object.fromEntries(request.headers.entries()));

      // 더 간단한 에러 응답
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'FORM_DATA_PARSE_ERROR',
          message: 'FormData 파싱에 실패했습니다. 다시 시도해주세요.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const file = formData.get('file');
    const routineIdValue = formData.get('routineId');
    const contentValue = formData.get('content');
    const nicknameValue = formData.get('nickname');

    console.log('FormData 내용:', {
      hasFile: !!file,
      fileType: file ? typeof file : 'undefined',
      isFileInstance: file instanceof File,
      fileSize: file instanceof File ? file.size : 'N/A',
      routineId: routineIdValue,
      content: contentValue,
      nickname: nicknameValue,
    });

    // 필수 필드 검증
    if (!nicknameValue || typeof nicknameValue !== 'string' || String(nicknameValue).trim() === '') {
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

    if (!contentValue || typeof contentValue !== 'string' || String(contentValue).trim() === '') {
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
    if (isNaN(routineIdNumber) || !routineIdValue) {
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
      console.log('이미지 업로드 시작:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

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
    } else {
      console.log('이미지 파일 없음 또는 유효하지 않은 파일');
    }

    console.log('루틴 완료 데이터 생성 시작:', {
      nickname: String(nicknameValue).trim(),
      routineId: routineIdNumber,
      content: String(contentValue).trim(),
      proofImgUrl,
    });

    // 루틴 완료 데이터 생성
    const addRoutineCompletionUseCase = createAddRoutineCompletionUseCase();

    const result = await addRoutineCompletionUseCase.execute({
      nickname: String(nicknameValue).trim(),
      routineId: routineIdNumber,
      content: String(contentValue).trim(),
      proofImgUrl,
    });

    console.log('루틴 완료 생성 성공:', result);

    const successResponse: ApiResponse<RoutineCompletionDto> = {
      success: true,
      data: result,
      message: '루틴이 성공적으로 완료되었습니다.'
    };
    return NextResponse.json(successResponse, { status: 201 });
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

// 루틴 완료 수정 (PATCH)
export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse<RoutineCompletionDto | null>>> {
  try {
    const { completionId, proofImgUrl } = await request.json();

    if (!completionId || typeof completionId !== 'number') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_COMPLETION_ID',
          message: '루틴 완료 ID가 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (proofImgUrl !== null && typeof proofImgUrl !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_PROOF_IMG_URL',
          message: '유효하지 않은 인증 이미지 URL입니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const usecase = createUpdateRoutineCompletionUseCase();
    const updatedCompletion = await usecase.execute(completionId, { proofImgUrl });

    const successResponse: ApiResponse<RoutineCompletionDto> = {
      success: true,
      data: RoutineCompletionDtoMapper.fromEntity(updatedCompletion),
      message: '루틴 완료가 성공적으로 수정되었습니다.'
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 완료 수정 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: error instanceof Error ? error.message : '루틴 완료 수정에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 루틴 완료 삭제 (DELETE)
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { completionId } = await request.json();

    if (!completionId || typeof completionId !== 'number') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'MISSING_COMPLETION_ID',
          message: '루틴 완료 ID가 필요합니다.'
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const usecase = createDeleteRoutineCompletionUseCase();
    await usecase.execute(completionId);

    const successResponse: ApiResponse<null> = {
      success: true,
      data: null,
      message: '루틴 완료가 성공적으로 삭제되었습니다.'
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('루틴 완료 삭제 중 오류 발생:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: error instanceof Error ? error.message : '루틴 완료 삭제에 실패했습니다.'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
