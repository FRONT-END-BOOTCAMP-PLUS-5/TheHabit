'use client';

import WeeklySlide from '@/app/_components/weekly-slides/WeeklySlide';
import { getKoreanDateFromDate } from '@/public/utils/dateUtils';
import { useState, useEffect } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import AddChallengeButton from './AddChallengeButton';
import '@ant-design/v5-patch-for-react-19';
import { useModalStore } from '@/libs/stores/modalStore';
import AddChallengeForm from './AddChallengeForm';
import { useGetDashboardByNickname } from '@/libs/hooks/dashboard-hooks/useGetDashboardByNickname';
import { useParams } from 'next/navigation';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import AllChallengeList from './AllChallengeList';
import CategoryChallengeList from './CategoryChallengeList';
import { Toast } from '@/app/_components/toasts/Toast';

const ChallengeListSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSort, setSelectedSort] = useState<string>('all');
  const [hasError, setHasError] = useState(false);
  const { openModal } = useModalStore();
  const params = useParams();
  const nickname = params.nickname as string;
  const { data: dashboard, error, isLoading, refetch } = useGetDashboardByNickname(nickname);

  // 에러 처리
  useEffect(() => {
    if (error) {
      setHasError(true);
      Toast.error('챌린지 목록을 불러오는 중 문제가 발생했습니다');
    }
  }, [error]);

  // 선택된 날짜가 챌린지 기간 내에 있는지 확인하는 함수
  const isDateInChallengePeriod = (challenge: ChallengeDto, date: Date): boolean => {
    try {
      // null 체크 추가
      if (!challenge.createdAt || !challenge.endAt) {
        return false;
      }

      // 챌린지 시작일과 종료일을 날짜만으로 변환 (시간 제거)
      const challengeStart = new Date(challenge.createdAt);
      const challengeStartDate = new Date(
        challengeStart.getFullYear(),
        challengeStart.getMonth(),
        challengeStart.getDate()
      );

      const challengeEnd = new Date(challenge.endAt);
      const challengeEndDate = new Date(
        challengeEnd.getFullYear(),
        challengeEnd.getMonth(),
        challengeEnd.getDate()
      );

      // 유효한 날짜인지 확인
      if (isNaN(challengeStartDate.getTime()) || isNaN(challengeEndDate.getTime())) {
        return false;
      }

      // 선택된 날짜를 날짜만으로 변환 (시간 제거)
      const selectedDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      return selectedDateOnly >= challengeStartDate && selectedDateOnly <= challengeEndDate;
    } catch (error) {
      console.error('날짜 변환 에러:', error);
      return false;
    }
  };

  // 선택된 날짜에 해당하는 활성 챌린지들만 필터링
  const getActiveChallengesForSelectedDate = () => {
    if (!dashboard?.challenge || !Array.isArray(dashboard.challenge)) {
      console.log('대시보드 데이터가 없거나 challenge가 배열이 아님');
      return [];
    }

    console.log('전체 챌린지 개수:', dashboard.challenge.length);
    console.log('선택된 날짜:', selectedDate.toISOString());

    const filteredChallenges = dashboard.challenge.filter(challenge => {
      // challenge 객체가 유효한지 확인
      if (!challenge || typeof challenge !== 'object') {
        console.log('챌린지 객체가 유효하지 않음:', challenge);
        return false;
      }

      // 필수 속성들이 존재하는지 확인
      if (!challenge.id || !challenge.createdAt || !challenge.endAt) {
        console.log('필수 속성 누락:', {
          id: challenge.id,
          createdAt: challenge.createdAt,
          endAt: challenge.endAt,
        });
        return false;
      }

      // active가 true인 챌린지만 필터링
      if (challenge.active !== true) {
        console.log('비활성 챌린지 제외:', challenge.name, 'active:', challenge.active);
        return false;
      }

      // completionProgress가 'in_progress'인 챌린지만 필터링
      if (challenge.completionProgress !== 'in_progress') {
        console.log(
          '진행중이 아닌 챌린지 제외:',
          challenge.name,
          'completionProgress:',
          challenge.completionProgress
        );
        return false;
      }

      const isInPeriod = isDateInChallengePeriod(challenge, selectedDate);
      console.log(`챌린지 "${challenge.name}": 기간 내 포함 여부 = ${isInPeriod}`);

      return isInPeriod;
    });

    console.log('필터링 후 챌린지 개수:', filteredChallenges.length);
    return filteredChallenges;
  };

  const handleOpenAddChallengeModal = () => {
    openModal(<AddChallengeForm />, 'toast');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSort = (e: RadioChangeEvent) => {
    setSelectedSort(e.target.value);
  };

  // 에러 상태 처리
  if (hasError) {
    return (
      <div className='flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg'>
        <div className='text-red-600 text-4xl mb-4'>⚠️</div>
        <h3 className='text-lg font-semibold text-red-800 mb-2'>
          챌린지 목록을 불러올 수 없습니다
        </h3>
        <p className='text-sm text-red-600 text-center mb-4'>
          잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의해주세요.
        </p>
        <div className='flex gap-3'>
          <button
            onClick={() => {
              setHasError(false);
              refetch();
            }}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium'
          >
            다시 시도
          </button>
          <button
            onClick={() => refetch()}
            className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium'
          >
            데이터 새로고침
          </button>
        </div>
      </div>
    );
  }

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <section className='flex flex-col gap-2 px-3 py-2 w-full relative mb-10'>
        {/* WeeklySlide 스켈레톤 */}
        <div className='w-full h-24 bg-gray-200 rounded-lg animate-pulse mb-4'></div>

        <div className='flex flex-col gap-3'>
          {/* 날짜 표시 스켈레톤 */}
          <div className='flex items-center justify-center'>
            <div className='w-32 h-8 bg-gray-200 rounded animate-pulse'></div>
          </div>

          {/* 라디오 버튼 그룹 스켈레톤 */}
          <div className='flex justify-center w-full'>
            <div className='flex gap-2 w-48'>
              <div className='flex-1 h-10 bg-gray-200 rounded animate-pulse'></div>
              <div className='flex-1 h-10 bg-gray-200 rounded animate-pulse'></div>
            </div>
          </div>

          {/* 챌린지 목록 스켈레톤 */}
          <div className='space-y-3'>
            {/* 챌린지 카드 1 */}
            <div className='h-15 bg-gray-200 rounded-lg animate-pulse'></div>
            {/* 챌린지 카드 2 */}
            <div className='h-15 bg-gray-200 rounded-lg animate-pulse'></div>
            {/* 챌린지 카드 3 */}
            <div className='h-15 bg-gray-200 rounded-lg animate-pulse'></div>
          </div>
        </div>

        {/* AddChallengeButton 스켈레톤 */}
        <div className='absolute bottom-0 right-0'>
          <div className='w-12 h-12 bg-gray-200 rounded-full animate-pulse'></div>
        </div>
      </section>
    );
  }

  return (
    <section className='flex flex-col gap-2 px-3 py-2 w-full relative mb-10'>
      <WeeklySlide onDateSelect={handleDateSelect} />
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-center font-bold text-2xl text-secondary'>
            {getKoreanDateFromDate(selectedDate)}
          </div>
          <div className='flex justify-center w-full'>
            <Radio.Group
              onChange={e => handleSort(e)}
              value={selectedSort}
              style={{
                marginBottom: 8,
                display: 'flex',
                width: '50%',
                justifyContent: 'center',
              }}
              buttonStyle='solid'
              className='custom-radio-group w-full max-w-md'
            >
              <Radio.Button value='all' className='flex-1 text-center'>
                전체
              </Radio.Button>
              <Radio.Button value='category' className='flex-1 text-center'>
                카테고리
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        {selectedSort === 'all' ? (
          <AllChallengeList
            challenges={getActiveChallengesForSelectedDate()}
            routines={dashboard?.routines || []}
            routineCompletions={dashboard?.routineCompletions || []}
            selectedDate={selectedDate}
            nickname={nickname}
          />
        ) : (
          dashboard && (
            <CategoryChallengeList
              categoryId={0}
              challenges={getActiveChallengesForSelectedDate()}
              routines={dashboard?.routines || []}
              routineCompletions={dashboard?.routineCompletions || []}
              selectedDate={selectedDate}
              onRoutineAdded={undefined}
              nickname={nickname}
            />
          )
        )}
      </div>
      <AddChallengeButton onClick={handleOpenAddChallengeModal} />
    </section>
  );
};

export default ChallengeListSection;
