import { useState } from 'react';
import { axiosInstance } from '@/libs/axios/axiosInstance';

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // interface SignUpData {
  //   email: string;
  //   password: string;
  //   passwordConfirm: string;
  //   nickname: string;
  //   profileImage: string | null;
  //   profileImagePath: string | null; // 추가
  // }

  const signUp = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
            '회원가입 실패'
          : err instanceof Error
          ? err.message
          : '회원가입 실패';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
}
