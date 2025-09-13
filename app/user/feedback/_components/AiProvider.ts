import { AiEntity } from '@/backend/ai/domain/entities/AiEntity';
import { GoogleGenAI } from '@google/genai';
import { AI_MODEL } from '@/public/consts/AiModel';
import OpenAI from 'openai';
import { AI_PROMPT } from '@/public/consts/AIPrompt';

export class GeminiProvider {
  private readonly client: GoogleGenAI;

  constructor(apiKey: string | undefined) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async generate(aiRequestContent: AiEntity): Promise<string> {
    const result = await this.client.models.generateContent({
      model: AI_MODEL.GEMINI,
      contents: [
        {
          role: 'user',
          parts: [
            { text: AI_PROMPT.GEMINI_FEEDBACK_SYSTEM_PROMPT },
            { text: aiRequestContent.aiResponseContent },
          ],
        },
      ],
    });

    const anyResult = result as any;
    const responseText = anyResult?.response?.text?.() ?? anyResult?.text ?? '';
    return typeof responseText === 'string' ? responseText : String(responseText ?? '');
  }
}

export class OpenAIProvider {
  private readonly client: OpenAI;

  constructor(apiKey: string | undefined) {
    this.client = new OpenAI({ apiKey });
  }

  async generate(aiRequestContent: AiEntity): Promise<string> {
    const response = await this.client.responses.create({
      model: AI_MODEL.OPENAI,
      instructions: AI_PROMPT.FEEDBACK_SYSTEM_PROMPT,
      input: aiRequestContent.aiResponseContent,
    });
    return response.output_text ?? '';
  }
}
