'use client';

import WeeklySlide from '@/app/_components/weekly-slides/WeeklySlide';
import { getKoreanDateFromDate } from '@/public/utils/dateUtils';
import { useState } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import AddChallengeButton from './AddChallengeButton';
import '@ant-design/v5-patch-for-react-19';
import { useModalStore } from '@/libs/stores/modalStore';
import AddChallengeForm from './AddChallengeForm';
import { useGetDashboardByNickname } from '@/libs/hooks';
import { useParams } from 'next/navigation';
import { ChallengeDto } from '@/backend/challenges/applications/dtos/ChallengeDto';
import AllChallengeList from './AllChallengeList';
import CategoryChallengeList from './CategoryChallengeList';

const ChallengeListSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSort, setSelectedSort] = useState<string>('all');
  const { openModal } = useModalStore();
  const params = useParams();
  const nickname = params.nickname as string;
  const { data: dashboard } = useGetDashboardByNickname(nickname);

  // 선택된 날짜가 챌린지 기간 내에 있는지 확인하는 함수
  const isDateInChallengePeriod = (challenge: ChallengeDto, date: Date): boolean => {
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

    // 선택된 날짜를 날짜만으로 변환 (시간 제거)
    const selectedDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return selectedDateOnly >= challengeStartDate && selectedDateOnly <= challengeEndDate;
  };

  // 선택된 날짜에 해당하는 챌린지들만 필터링
  const getChallengesForSelectedDate = () => {
    if (!dashboard?.challenge) return [];
    return dashboard.challenge.filter(challenge =>
      isDateInChallengePeriod(challenge, selectedDate)
    );
  };

  const handleOpenModal = () => {
    openModal(<AddChallengeForm />, 'toast');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSort = (e: RadioChangeEvent) => {
    setSelectedSort(e.target.value);
  };

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
            challenges={getChallengesForSelectedDate()}
            routines={dashboard?.routines || []}
            routineCompletions={dashboard?.routineCompletions || []}
            selectedDate={selectedDate}
          />
        ) : (
          dashboard && (
            <CategoryChallengeList
              dashboard={dashboard}
              challenges={getChallengesForSelectedDate()}
              routines={dashboard?.routines || []}
              routineCompletions={dashboard?.routineCompletions || []}
              selectedDate={selectedDate}
            />
          )
        )}
      </div>
      <AddChallengeButton onClick={handleOpenModal} />
    </section>
  );
};

export default ChallengeListSection;
