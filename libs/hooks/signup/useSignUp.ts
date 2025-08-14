import { useState } from 'react';
<<<<<<< HEAD
=======
import { axiosInstance } from '@/libs/axios/axiosInstance';
>>>>>>> 3774aacf0fc1c0dd1a5cf1b67bad11d5e008a55b

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface SignUpData {
    email: string;
    password: string;
    passwordConfirm: string;
    nickname: string;
    profileImage: string | null;
  }

  const signUp = async (userData: SignUpData) => {
    setLoading(true);
    setError(null);
    
    try {
<<<<<<< HEAD
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '회원가입 실패');
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      throw err;
=======
      const response = await axiosInstance.post('/api/signup', userData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || '회원가입 실패'
        : err instanceof Error 
          ? err.message 
          : '회원가입 실패';
      setError(errorMessage);
      throw new Error(errorMessage);
>>>>>>> 3774aacf0fc1c0dd1a5cf1b67bad11d5e008a55b
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
}