import { AddGPTResponseUsecase } from '@/backend/gpt/applications/usecases/AddGPTResponseUsecase';
import { GPTRepository } from '@/backend/gpt/infrastructures/repositories/GPTRepository';
import { NextRequest, NextResponse } from 'next/server';

interface GPTRequestBody {
  gptResponseContent: string;
  enabled: boolean;
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body: GPTRequestBody = await request.json();

    if (!body || !body.gptResponseContent || typeof body.gptResponseContent !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'gptRequestContent 필드가 필요합니다.',
        },
        { status: 400 }
      );
    }

    const gptRepository = new GPTRepository();
    const addGPTResponseUsecase = new AddGPTResponseUsecase(gptRepository);

    const result = await addGPTResponseUsecase.execute({
      gptResponseContent: body.gptResponseContent,
    });

    return NextResponse.json({
      success: true,
      response: result,
      message: '피드백이 성공적으로 생성되었습니다.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
};
