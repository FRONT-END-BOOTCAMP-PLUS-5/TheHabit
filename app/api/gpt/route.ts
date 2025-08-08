import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const POST = async ({ request }: { request: NextRequest }) => {
  const body = await request.json();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const response = await openai.responses.create({
    model: "gpt-5",
    instructions:
      "너는 습관 피드백을 전문적으로 주는 사람이야. 사용자가 입력한 습관 피드백을 분석하고, 사용자에게 적절한 피드백을 줘. 피드백은 한글로 줘",
    input: body.input,
  });

  return NextResponse.json({ response: response.output });
};
