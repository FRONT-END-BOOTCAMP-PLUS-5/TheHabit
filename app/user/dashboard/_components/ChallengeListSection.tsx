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

const ChallengeListSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSort, setSelectedSort] = useState<string>('all');
  const { openModal } = useModalStore();
  const params = useParams();
  const nickname = params.nickname as string;
  const { data: dashboard } = useGetDashboardByNickname(nickname);

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
      {dashboard?.challenge.map(challenge => (
        <ChallengesAccordion
          key={challenge.id}
          challenge={challenge}
          routines={dashboard?.routines || []}
          routineCompletions={dashboard?.routineCompletions || []}
        />
      ))}
    </div>
  );

  return (
    <section className='flex flex-col gap-2 px-2 py-2 w-full relative mb-10'>
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
        {selectedSort === 'all' ? allChallenges : <div />}
      </div>
      <AddChallengeButton onClick={handleOpenModal} />
    </section>
  );
};

export default ChallengeListSection;
