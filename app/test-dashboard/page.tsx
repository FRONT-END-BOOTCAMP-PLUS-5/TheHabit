'use client';

import { useState } from 'react';
import { DashboardByNicknameSection } from './_components/DashboardByNicknameSection';
import { AllDashboardsSection } from './_components/AllDashboardsSection';

export default function TestDashboardPage() {
  const [activeTab, setActiveTab] = useState<'nickname' | 'all'>('nickname');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Dashboard API 테스트 페이지
          </h1>
          <p className="text-gray-600 mb-6">
            Dashboard 도메인의 API들을 테스트해보세요
          </p>

          {/* 탭 네비게이션 */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('nickname')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'nickname'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              닉네임별 대시보드 조회
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              전체 대시보드 조회
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === 'nickname' && <DashboardByNicknameSection />}
          {activeTab === 'all' && <AllDashboardsSection />}
        </div>
      </div>
    </div>
  );
}
