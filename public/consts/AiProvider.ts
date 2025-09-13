export const AI_PROVIDER = {
  OPENAI: 'openai',
  GEMINI: 'gemini',
} as const;

export type AiProviderKey = typeof AI_PROVIDER[keyof typeof AI_PROVIDER];


