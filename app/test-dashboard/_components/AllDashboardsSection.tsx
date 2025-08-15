'use client';

import { useGetAllDashboards } from '@/libs/hooks';
import { LoadingSpinner } from '@/app/_components/loading/LoadingSpinner';

export function AllDashboardsSection() {
  const { data: dashboardList, isLoading, error, refetch } = useGetAllDashboards();

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          📊 전체 대시보드 조회 테스트
        </h3>
        <p className="text-purple-700 text-sm">
          모든 사용자의 대시보드 정보를 조회해보세요.
        </p>
      </div>

      {/* 새로고침 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '새로고침 중...' : '새로고침'}
        </button>
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

      {/* 대시보드 목록 표시 */}
      {dashboardList && !isLoading && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-green-800 font-semibold mb-4">
            ✅ 전체 대시보드 조회 성공 (총 {dashboardList.totalCount}개)
          </h4>
          
          <div className="space-y-4">
            {dashboardList.dashboards.length > 0 ? (
              dashboardList.dashboards.map((dashboard, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">
                      대시보드 #{index + 1}
                    </h5>
                    <span className="text-sm text-gray-500">
                      루틴 {dashboard.routineCount}개
                    </span>
                  </div>
                  
                  {/* 챌린지 정보 */}
                  <div className="mb-3">
                    <h6 className="text-sm font-medium text-gray-600 mb-1">챌린지</h6>
                    {dashboard.challenge ? (
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: dashboard.challenge.color }}
                        />
                        <span className="text-sm text-gray-900">{dashboard.challenge.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(dashboard.challenge.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">챌린지가 없습니다.</p>
                    )}
                  </div>

                  {/* 루틴 정보 */}
                  <div>
                    <h6 className="text-sm font-medium text-gray-600 mb-1">루틴</h6>
                    {dashboard.routines.length > 0 ? (
                      <div className="space-y-1">
                        {dashboard.routines.slice(0, 3).map((routine) => (
                          <div key={routine.id} className="flex items-center gap-2 text-xs">
                            <span>🎯</span>
                            <span className="text-gray-900">{routine.routineTitle}</span>
                            {routine.alertTime && (
                              <span className="text-gray-500">
                                ({new Date(routine.alertTime).toLocaleTimeString()})
                              </span>
                            )}
                          </div>
                        ))}
                        {dashboard.routines.length > 3 && (
                          <p className="text-xs text-gray-500 italic">
                            ... 외 {dashboard.routines.length - 3}개 더
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">루틴이 없습니다.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <p className="text-gray-500 italic text-center">대시보드가 없습니다.</p>
              </div>
            )}

            {/* 원시 데이터 (디버깅용) */}
            <details className="bg-white rounded-lg p-4 border border-green-100">
              <summary className="font-medium text-gray-900 cursor-pointer">
                🔍 원시 데이터 보기 (디버깅용)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(dashboardList, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
