'use client';

import { useState } from 'react';
import { useGetDashboardByNickname } from '@/libs/hooks';
import { LoadingSpinner } from '@/app/_components/loading/LoadingSpinner';

export function DashboardByNicknameSection() {
  const [nickname, setNickname] = useState<string>('');
  const [searchNickname, setSearchNickname] = useState<string>('');

  const { data: dashboard, isLoading, error, refetch } = useGetDashboardByNickname(searchNickname);

  const handleSearch = () => {
    if (nickname.trim()) {
      setSearchNickname(nickname.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🔍 닉네임별 대시보드 조회 테스트
        </h3>
        <p className="text-blue-700 text-sm">
          사용자의 닉네임을 입력하여 해당 사용자의 대시보드 정보를 조회해보세요.
        </p>
      </div>

      {/* 검색 입력 */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
            닉네임 입력
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="예: sign2test, HarenKei, 정승민"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!nickname.trim() || isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '조회 중...' : '조회하기'}
        </button>
        {searchNickname && (
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            새로고침
          </button>
        )}
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium mb-2">❌ 에러 발생</h4>
          <p className="text-red-700 text-sm">{error.message}</p>
        </div>
      )}

      {/* 대시보드 데이터 표시 */}
      {dashboard && !isLoading && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-green-800 font-semibold mb-4">✅ 대시보드 조회 성공</h4>
          
          <div className="space-y-4">
            {/* 챌린지 정보 */}
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <h5 className="font-medium text-gray-900 mb-2">챌린지 정보</h5>
              {dashboard.challenge ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">이름:</span>
                    <span className="ml-2 text-gray-900">{dashboard.challenge.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">색상:</span>
                    <span className="ml-2 text-gray-900">{dashboard.challenge.color}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">시작일:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(dashboard.challenge.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">종료일:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(dashboard.challenge.endAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">챌린지가 없습니다.</p>
              )}
            </div>

            {/* 루틴 정보 */}
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <h5 className="font-medium text-gray-900 mb-2">
                루틴 정보 (총 {dashboard.routineCount}개)
              </h5>
              {dashboard.routines.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.routines.map((routine, index) => (
                    <div key={routine.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🎯</span>
                          <span className="font-medium">{routine.routineTitle}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {routine.alertTime ? new Date(routine.alertTime).toLocaleTimeString() : '알림 없음'}
                        </div>
                      </div>
                      
                      {/* 루틴 완료 정보 */}
                      <div className="ml-8">
                        <h6 className="text-sm font-medium text-gray-600 mb-1">완료 기록</h6>
                        {dashboard.routineCompletion.filter(completion => completion.routineId === routine.id).length > 0 ? (
                          <div className="space-y-2">
                            {dashboard.routineCompletion
                              .filter(completion => completion.routineId === routine.id)
                              .map(completion => (
                                <div key={completion.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded border border-blue-100">
                                  <span className="text-blue-600">✅</span>
                                  <div className="flex-1">
                                    <div className="text-sm text-blue-800">
                                      {new Date(completion.createdAt).toLocaleString()}
                                    </div>
                                    {completion.proofImgUrl && (
                                      <div className="text-xs text-blue-600">
                                        증명 이미지: {completion.proofImgUrl}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic">완료 기록이 없습니다.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">루틴이 없습니다.</p>
              )}
            </div>

            {/* 원시 데이터 (디버깅용) */}
            <details className="bg-white rounded-lg p-4 border border-green-100">
              <summary className="font-medium text-gray-900 cursor-pointer">
                🔍 원시 데이터 보기 (디버깅용)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(dashboard, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
