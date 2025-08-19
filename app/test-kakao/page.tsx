'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function TestKakaoPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn('kakao', {
        callbackUrl: '/test-kakao',
        redirect: false,
      });

      if (result?.error) {
        setError(`카카오 로그인 실패: ${result.error}`);
      }
    } catch (err) {
      setError(`로그인 중 오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut({ callbackUrl: '/test-kakao' });
    } catch (err) {
      setError(`로그아웃 중 오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // 세션 새로고침을 위해 페이지 새로고침
      window.location.reload();
    } catch (err) {
      setError(`세션 새로고침 중 오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 카카오 로그인 테스트 페이지
          </h1>
          <p className="text-lg text-gray-600">
            NextAuth와 카카오 로그인 기능을 테스트해보세요
          </p>
        </div>

        {/* 상태 표시 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 현재 상태</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-24">상태:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === 'authenticated' 
                  ? 'bg-green-100 text-green-800' 
                  : status === 'loading' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {status === 'authenticated' ? '로그인됨' : 
                 status === 'loading' ? '로딩 중' : '로그인 안됨'}
              </span>
            </div>
            
            {session?.user && (
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">프로바이더:</span>
                <span className="text-gray-900">
                  {session.user.provider || '알 수 없음'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 로그인/로그아웃 버튼 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 인증 테스트</h2>
          <div className="flex flex-wrap gap-4">
            {status === 'unauthenticated' ? (
              <button
                onClick={handleKakaoLogin}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black font-medium rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                ) : (
                  <span className="mr-2">🎯</span>
                )}
                카카오로 로그인
              </button>
            ) : (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <span className="mr-2">🚪</span>
                )}
                로그아웃
              </button>
            )}
            
            {status === 'authenticated' && (
              <button
                onClick={handleRefreshSession}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <span className="mr-2">🔄</span>
                )}
                세션 새로고침
              </button>
            )}
          </div>
        </div>

        {/* 사용자 정보 표시 */}
        {session?.user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">👤 사용자 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">기본 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {session.user.id || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이메일:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {session.user.email || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">사용자명:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {session.user.username || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">닉네임:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {session.user.nickname || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">프로필 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">프로필 이미지:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {session.user.profileImg || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이미지 경로:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {session.user.profileImgPath || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">생성 시간:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {session.user.createdAt ? new Date(session.user.createdAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">수정 시간:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {session.user.updatedAt ? new Date(session.user.updatedAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 세션 정보 표시 */}
        {session && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 세션 정보</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 overflow-x-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">에러 발생</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 테스트 가이드 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">📚 테스트 가이드</h2>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start">
              <span className="mr-2">1.</span>
              <p>카카오 로그인 버튼을 클릭하여 로그인을 시도해보세요</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2">2.</span>
              <p>로그인 성공 시 사용자 정보와 세션 정보를 확인해보세요</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2">3.</span>
              <p>세션 새로고침 버튼으로 토큰 갱신을 테스트해보세요</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2">4.</span>
              <p>로그아웃 후 다시 로그인하여 세션 상태 변화를 관찰해보세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

