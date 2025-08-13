import { useState } from 'react';

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
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
}