'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 빈 대시보드 상태를 테스트하기 위한 임시 페이지
// 접속 시 자동으로 존재하지 않는 닉네임으로 이동합니다.
export default function DashboardEmptyTestPage() {
  const router = useRouter();

  useEffect(() => {
    // 실제로 존재하지 않을 법한 닉네임으로 이동
    router.replace('/user/dashboard/__empty_test_nickname__');
  }, [router]);

  return (
    <main className='px-2 py-6'>
      <div className='text-center text-gray-600'>빈 대시보드 테스트 페이지로 이동 중...</div>
    </main>
  );
}
