'use client';

import { useState } from 'react';
import { useModalStore } from '@/libs/stores/modalStore';
import { ChallengeExtensionContent } from '@/app/_components/challenges-accordion/ChallengeExtensionContent';

export default function ModalTestPage() {
  const [selectedChallenge, setSelectedChallenge] = useState('운동하기');
  const [modalType, setModalType] = useState<'extension' | 'confirm'>('extension');
  const { openModal, closeModal, isOpen, modalTitle, modalDescription } = useModalStore();

  const handleOpenExtensionModal = () => {
    setModalType('extension');
    openModal(
      <ChallengeExtensionContent
        challenge={{
          id: 1,
          name: selectedChallenge,
          createdAt: new Date().toISOString(),
          endAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          color: '#3B82F6',
          categoryId: 1,
          active: true,
          completionProgress: 'in_progress',
        }}
        nickname='test-user'
        onSuccess={() => {
          alert('🚀 챌린지가 성공적으로 처리되었습니다!');
          closeModal();
        }}
      />,
      'floating',
      '챌린지 연장',
      '21일 챌린지 완료'
    );
  };

  const handleOpenConfirmModal = () => {
    setModalType('confirm');
    openModal(
      <div className='text-center py-4'>
        <p className='text-gray-600 mb-4'>이것은 일반적인 확인 모달의 컨텐츠입니다.</p>
      </div>,
      'floating',
      '일반 확인 모달',
      '테스트용'
    );
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-gray-800 mb-8 text-center'>🧪 모달 테스트 페이지</h1>

        {/* 테스트 컨트롤 */}
        <div className='bg-white rounded-xl p-6 mb-8 shadow-lg'>
          <h2 className='text-xl font-bold mb-4'>테스트 설정</h2>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>챌린지 이름</label>
            <input
              type='text'
              value={selectedChallenge}
              onChange={e => setSelectedChallenge(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='챌린지 이름을 입력하세요'
            />
          </div>

          <div className='flex gap-4'>
            <button
              onClick={handleOpenExtensionModal}
              className='px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all duration-200'
            >
              🎯 챌린지 연장 모달 열기
            </button>

            <button
              onClick={handleOpenConfirmModal}
              className='px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-all duration-200'
            >
              📋 일반 확인 모달 열기
            </button>
          </div>
        </div>

        {/* 모달 정보 */}
        <div className='bg-white rounded-xl p-6 shadow-lg'>
          <h2 className='text-xl font-bold mb-4'>모달 상태</h2>
          <div className='space-y-2 text-sm'>
            <p>
              <strong>모달 열림:</strong> {isOpen ? '✅ 열림' : '❌ 닫힘'}
            </p>
            <p>
              <strong>현재 모달 타입:</strong> {modalType}
            </p>
            <p>
              <strong>선택된 챌린지:</strong> {selectedChallenge}
            </p>
            <p>
              <strong>모달 제목:</strong> {modalTitle || '없음'}
            </p>
            <p>
              <strong>모달 설명:</strong> {modalDescription || '없음'}
            </p>
          </div>
        </div>

        {/* 사용법 설명 */}
        <div className='mt-8 bg-blue-50 rounded-xl p-6'>
          <h3 className='text-lg font-bold text-blue-800 mb-3'>사용법</h3>
          <ul className='text-blue-700 space-y-2'>
            <li>• 챌린지 이름을 입력하고 &ldquo;챌린지 연장 모달 열기&rdquo; 버튼을 클릭하세요</li>
            <li>• &ldquo;66일로 연장하기&rdquo; 버튼을 클릭하면 연장 알림이 표시됩니다</li>
            <li>• &ldquo;완료하고 종료하기&rdquo; 버튼을 클릭하면 완료 알림이 표시됩니다</li>
            <li>• 일반 확인 모달도 테스트해볼 수 있습니다</li>
          </ul>
        </div>

        {/* 주의사항 */}
        <div className='mt-8 bg-yellow-50 rounded-xl p-6'>
          <h3 className='text-lg font-bold text-yellow-800 mb-3'>⚠️ 주의사항</h3>
          <p className='text-yellow-700'>
            이 페이지는 ModalProvider를 통해 모달을 표시합니다. ConfirmModal을 직접 렌더링하지 않아
            모달 중복 문제를 방지합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
