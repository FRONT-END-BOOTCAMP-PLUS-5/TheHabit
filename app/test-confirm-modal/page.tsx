'use client';

import { useState } from 'react';
import ConfirmModal from '@/app/_components/modals/ConfirmModal';
import { Button } from '@/app/_components/buttons/Button';
import { Toast } from '@/app/_components/toasts/Toast';

const TestConfirmModalPage: React.FC = () => {
  const [isPositiveModalOpen, setIsPositiveModalOpen] = useState<boolean>(false);
  const [isNegativeModalOpen, setIsNegativeModalOpen] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isComplexModalOpen, setIsComplexModalOpen] = useState<boolean>(false);

  const handlePositiveConfirm = () => {
    Toast.success('확인 버튼이 클릭되었습니다! 🎉');
    setIsPositiveModalOpen(false);
  };

  const handleNegativeConfirm = () => {
    Toast.error('취소 버튼이 클릭되었습니다! ❌');
    setIsNegativeModalOpen(false);
  };

  const handleCustomConfirm = () => {
    Toast.info('커스텀 확인이 클릭되었습니다! ℹ️');
    setIsCustomModalOpen(false);
  };

  const handleDeleteUser = () => {
    Toast.warning('사용자 계정이 삭제되었습니다! ⚠️');
    setIsComplexModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        <header className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>🧪 ConfirmModal 테스트 페이지</h1>
          <p className='text-gray-600'>다양한 ConfirmModal 시나리오를 테스트해보세요!</p>
        </header>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* 기본 Positive 모달 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>✅ 기본 Positive 모달</h2>
            <p className='text-sm text-gray-600 mb-4'>간단한 확인 모달을 테스트합니다.</p>
            <Button
              buttonType='primary'
              onClick={() => setIsPositiveModalOpen(true)}
              className='w-full'
            >
              Positive 모달 열기
            </Button>
          </div>

          {/* 기본 Negative 모달 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>❌ 기본 Negative 모달</h2>
            <p className='text-sm text-gray-600 mb-4'>취소 액션을 위한 모달을 테스트합니다.</p>
            <Button
              buttonType='secondary'
              onClick={() => setIsNegativeModalOpen(true)}
              className='w-full'
            >
              Negative 모달 열기
            </Button>
          </div>

          {/* 커스텀 내용 모달 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>🎨 커스텀 내용 모달</h2>
            <p className='text-sm text-gray-600 mb-4'>
              사용자 정의 내용이 포함된 모달을 테스트합니다.
            </p>
            <Button
              buttonType='primary'
              onClick={() => setIsCustomModalOpen(true)}
              className='w-full'
            >
              커스텀 모달 열기
            </Button>
          </div>

          {/* 복잡한 액션 모달 테스트 */}
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>🔧 복잡한 액션 모달</h2>
            <p className='text-sm text-gray-600 mb-4'>여러 액션이 포함된 모달을 테스트합니다.</p>
            <Button
              buttonType='danger'
              onClick={() => setIsComplexModalOpen(true)}
              className='w-full'
            >
              복잡한 모달 열기
            </Button>
          </div>
        </div>

        {/* 버튼 타입 테스트 섹션 */}
        <div className='bg-white p-6 rounded-lg shadow-sm border mt-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>🔘 Button 컴포넌트 테스트</h2>
          <p className='text-sm text-gray-600 mb-4'>
            새로운 Button 컴포넌트의 다양한 타입을 테스트해보세요.
          </p>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
            <Button buttonType='primary' className='w-full'>
              Primary
            </Button>
            <Button buttonType='secondary' className='w-full'>
              Secondary
            </Button>
            <Button buttonType='tertiary' className='w-full'>
              Tertiary
            </Button>
            <Button buttonType='danger' className='w-full'>
              Danger
            </Button>
            <Button buttonType='link' className='w-full'>
              Link
            </Button>
          </div>
        </div>

        {/* 모달 사용법 가이드 */}
        <div className='bg-white p-6 rounded-lg shadow-sm border mt-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>📚 ConfirmModal 사용법</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
            <div>
              <h3 className='font-semibold mb-2'>Props:</h3>
              <ul className='space-y-1'>
                <li>
                  • <code>type</code>: &apos;positive&apos; | &apos;negative&apos;
                </li>
                <li>
                  • <code>title</code>: 모달 제목
                </li>
                <li>
                  • <code>description</code>: 모달 설명
                </li>
                <li>
                  • <code>children</code>: 모달 내용
                </li>
                <li>
                  • <code>isOpen</code>: 모달 열림 상태
                </li>
                <li>
                  • <code>onClose</code>: 닫기 핸들러
                </li>
                <li>
                  • <code>onConfirm</code>: 확인 핸들러
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold mb-2'>특징:</h3>
              <ul className='space-y-1'>
                <li>• 부드러운 애니메이션 효과</li>
                <li>• 배경 클릭으로 닫기</li>
                <li>• ESC 키로 닫기 (추가 가능)</li>
                <li>• 반응형 디자인</li>
                <li>• 커스텀 내용 지원</li>
                <li>• 확인/취소 버튼 자동 생성</li>
              </ul>
            </div>
          </div>
        </div>

        <footer className='text-center mt-8 text-gray-500 text-sm'>
          <p>모달 테스트 완료 후에는 페이지를 새로고침하여 초기 상태로 돌아가세요.</p>
        </footer>
      </div>

      {/* Positive 모달 */}
      <ConfirmModal
        type='positive'
        title='확인 모달'
        description='이 작업을 진행하시겠습니까?'
        isOpen={isPositiveModalOpen}
        onClose={() => setIsPositiveModalOpen(false)}
        onConfirm={handlePositiveConfirm}
      >
        <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <p className='text-sm text-blue-800'>
            이 모달은 사용자에게 중요한 결정을 요청할 때 사용됩니다. 확인 버튼을 클릭하면 작업이
            진행됩니다.
          </p>
        </div>
      </ConfirmModal>

      {/* Negative 모달 */}
      <ConfirmModal
        type='negative'
        title='취소 확인'
        description='작업을 취소하시겠습니까?'
        isOpen={isNegativeModalOpen}
        onClose={() => setIsNegativeModalOpen(false)}
        onConfirm={handleNegativeConfirm}
      >
        <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <p className='text-sm text-yellow-800'>
            이 모달은 사용자에게 작업 취소를 확인할 때 사용됩니다. 취소 버튼을 클릭하면 작업이
            중단됩니다.
          </p>
        </div>
      </ConfirmModal>

      {/* 커스텀 내용 모달 */}
      <ConfirmModal
        type='positive'
        title='프로필 업데이트'
        description='변경사항을 저장하시겠습니까?'
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onConfirm={handleCustomConfirm}
      >
        <div className='mt-4 space-y-3'>
          <div className='p-3 bg-gray-50 border border-gray-200 rounded-lg'>
            <h4 className='font-medium text-gray-800 mb-2'>변경된 내용:</h4>
            <ul className='text-sm text-gray-600 space-y-1'>
              <li>• 사용자명: &quot;김철수&quot; → &quot;김영희&quot;</li>
              <li>• 프로필 이미지: 새 이미지로 변경</li>
              <li>• 자기소개: &quot;안녕하세요&quot; 추가</li>
            </ul>
          </div>
          <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
            <p className='text-sm text-green-800'>💡 저장하지 않으면 변경사항이 사라집니다.</p>
          </div>
        </div>
      </ConfirmModal>

      {/* 복잡한 액션 모달 */}
      <ConfirmModal
        type='negative'
        title='계정 삭제'
        description='이 작업은 되돌릴 수 없습니다'
        isOpen={isComplexModalOpen}
        onClose={() => setIsComplexModalOpen(false)}
        onConfirm={handleDeleteUser}
      >
        <div className='mt-4 space-y-4'>
          <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-red-600 text-xl'>⚠️</span>
              <h4 className='font-medium text-red-800'>주의사항</h4>
            </div>
            <ul className='text-sm text-red-700 space-y-1'>
              <li>• 모든 데이터가 영구적으로 삭제됩니다</li>
              <li>• 진행 중인 챌린지와 루틴이 모두 사라집니다</li>
              <li>• 친구 목록과 팔로우 관계가 해제됩니다</li>
              <li>• 이 작업은 되돌릴 수 없습니다</li>
            </ul>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default TestConfirmModalPage;
