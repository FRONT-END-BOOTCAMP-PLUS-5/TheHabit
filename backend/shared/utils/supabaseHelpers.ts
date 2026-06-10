import { PostgrestError } from '@supabase/supabase-js';

export function assertSupabaseData<T>(
  data: T | null,
  error: PostgrestError | null,
  fallbackMessage = '데이터베이스 요청에 실패했습니다.'
): T {
  if (error) {
    throw new Error(error.message || fallbackMessage);
  }
  if (data === null || data === undefined) {
    throw new Error(fallbackMessage);
  }
  return data;
}

export function isUniqueViolation(error: PostgrestError | null): boolean {
  return error?.code === '23505';
}
