'use client';

import ChallengesAccordion from '@/app/_components/challenges-accordion/ChallengesAccordion';
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

  const allChallenges: React.ReactNode = (
    <div className='flex flex-col gap-0.5'>
      {getChallengesForSelectedDate().length > 0 ? (
        getChallengesForSelectedDate().map(challenge => (
          <ChallengesAccordion
            key={challenge.id}
            challenge={challenge}
            routines={dashboard?.routines || []}
            routineCompletions={dashboard?.routineCompletions || []}
          />
        ))
      ) : (
        <div className='text-center py-8 text-gray-500'>
          {selectedDate.toLocaleDateString()}에 해당하는 챌린지가 없습니다
        </div>
      )}
    </div>
  );

  const categoryChallenges: React.ReactNode = (
    <div className='flex flex-col gap-2'>
      <div className='text-2xl font-bold text-secondary mb-3'>
        <h2>건강</h2>
      </div>
      <div className='flex flex-col gap-0.5'>
        {!dashboard ? (
          <div className='text-center py-4 text-gray-500 text-sm'>
            챌린지 데이터를 불러오는 중...
          </div>
        ) : dashboard.challenge && dashboard.challenge.length > 0 ? (
          getChallengesForSelectedDate().filter(challenge => challenge.categoryId === 0).length >
          0 ? (
            getChallengesForSelectedDate()
              .filter(challenge => challenge.categoryId === 0)
              .map(challenge => (
                <ChallengesAccordion
                  key={challenge.id}
                  challenge={challenge}
                  routines={dashboard?.routines || []}
                  routineCompletions={dashboard?.routineCompletions || []}
                />
              ))
          ) : (
            <div className='text-center py-4 text-gray-500 text-sm'>
              {selectedDate.toLocaleDateString()}에 건강 카테고리의 챌린지가 없습니다
            </div>
          )
        ) : (
          <div className='text-center py-4 text-gray-500 text-sm'>챌린지가 없습니다</div>
        )}
        <div className='text-2xl font-bold text-secondary'>
          <h2>공부</h2>
        </div>
        <div className='flex flex-col gap-0.5'>
          {!dashboard ? (
            <div className='text-center py-4 text-gray-500 text-sm'>
              챌린지 데이터를 불러오는 중...
            </div>
          ) : dashboard.challenge && dashboard.challenge.length > 0 ? (
            getChallengesForSelectedDate().filter(challenge => challenge.categoryId === 1).length >
            0 ? (
              getChallengesForSelectedDate()
                .filter(challenge => challenge.categoryId === 1)
                .map(challenge => (
                  <ChallengesAccordion
                    key={challenge.id}
                    challenge={challenge}
                    routines={dashboard?.routines || []}
                    routineCompletions={dashboard?.routineCompletions || []}
                  />
                ))
            ) : (
              <div className='text-center py-4 text-gray-500 text-sm'>
                {selectedDate.toLocaleDateString()}에 공부 카테고리의 챌린지가 없습니다
              </div>
            )
          ) : (
            <div className='text-center py-4 text-gray-500 text-sm'>챌린지가 없습니다</div>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-0.5'>
        <div className='text-2xl font-bold text-secondary'>
          <h2>자기개발</h2>
        </div>
        <div className='flex flex-col gap-0.5'>
          {!dashboard ? (
            <div className='text-center py-4 text-gray-500 text-sm'>
              챌린지 데이터를 불러오는 중...
            </div>
          ) : dashboard.challenge && dashboard.challenge.length > 0 ? (
            getChallengesForSelectedDate().filter(challenge => challenge.categoryId === 2).length >
            0 ? (
              getChallengesForSelectedDate()
                .filter(challenge => challenge.categoryId === 2)
                .map(challenge => (
                  <ChallengesAccordion
                    key={challenge.id}
                    challenge={challenge}
                    routines={dashboard?.routines || []}
                    routineCompletions={dashboard?.routineCompletions || []}
                  />
                ))
            ) : (
              <div className='text-center py-4 text-gray-500 text-sm'>
                {selectedDate.toLocaleDateString()}에 자기개발 카테고리의 챌린지가 없습니다
              </div>
            )
          ) : (
            <div className='text-center py-4 text-gray-500 text-sm'>챌린지가 없습니다</div>
          )}
        </div>
      </div>
      <div className='text-2xl font-bold text-secondary'>
        <h2>기타</h2>
      </div>
      <div className='flex flex-col gap-0.5'>
        {!dashboard ? (
          <div className='text-center py-4 text-gray-500 text-sm'>
            챌린지 데이터를 불러오는 중...
          </div>
        ) : dashboard.challenge && dashboard.challenge.length > 0 ? (
          getChallengesForSelectedDate().filter(challenge => challenge.categoryId === 3).length >
          0 ? (
            getChallengesForSelectedDate()
              .filter(challenge => challenge.categoryId === 3)
              .map(challenge => (
                <ChallengesAccordion
                  key={challenge.id}
                  challenge={challenge}
                  routines={dashboard?.routines || []}
                  routineCompletions={dashboard?.routineCompletions || []}
                />
              ))
          ) : (
            <div className='text-center py-4 text-gray-500 text-sm'>
              {selectedDate.toLocaleDateString()}에 기타 카테고리의 챌린지가 없습니다
            </div>
          )
        ) : (
          <div className='text-center py-4 text-gray-500 text-sm'>챌린지가 없습니다</div>
        )}
      </div>
    </div>
  );

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
        {selectedSort === 'all' ? allChallenges : categoryChallenges}
      </div>
      <AddChallengeButton onClick={handleOpenModal} />
    </section>
  );
};

export default ChallengeListSection;
