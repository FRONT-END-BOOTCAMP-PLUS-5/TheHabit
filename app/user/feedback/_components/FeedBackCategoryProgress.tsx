import { DashboardDto } from '@/backend/dashboards/application/dtos/DashboardDto';
import { Progress } from 'antd';

export const FeedBackCategoryProgress = ({ dashBoardData }: { dashBoardData: DashboardDto }) => {
  const { challenge } = dashBoardData;

  const data = challenge.map(challenge => {
    return {
      name: challenge.name,
      createdAt: challenge.createdAt,
      category: challenge.categoryId,
      active: challenge.active,
    };
  });

  //여기도 루틴이 필요함 루틴 완료 확인 -> 이미지로 확인 해야 함
  const progressBarLabel = [
    {
      name: '건강',
      id: 1,
      color: '#FFB347',
      textClass: 'text-[#FFB347]',
    },
    {
      name: '자기계발',
      id: 2,
      color: '#3B82F6',
      textClass: 'text-[#3B82F6]',
    },
    {
      name: '공부',
      id: 3,
      color: '#F472B6',
      textClass: 'text-[#F472B6]',
    },
    {
      name: '생활',
      id: 4,
      color: '#6A89CC',
      textClass: 'text-[#6A89CC]',
    },
    {
      name: '기타',
      id: 5,
      color: '#93d50b',
      textClass: 'text-[#93d50b]',
    },
  ];

  // 카테고리별로 챌린지 데이터 구분
  const categoryData = progressBarLabel.map(category => {
    // 해당 카테고리에 속한 챌린지들 필터링
    const categoryChallenges = data.filter(item => item.category === category.id);

    return {
      ...category,
      challenges: categoryChallenges,
      challengeCount: categoryChallenges.length,
      activeCount: categoryChallenges.filter(ch => ch.active).length,
    };
  });

  return (
    <section className='w-full flex flex-col gap-3 mt-10'>
      <h3 className='text-2xl font-bold'>카테고리별 통계</h3>
      {categoryData.map(category => {
        // 간단한 진행률 계산 (챌린지 수 기준)
        const progressPercent =
          category.challengeCount > 0
            ? Math.round((category.activeCount / category.challengeCount) * 100)
            : 0;

        return (
          <div key={category.id} className='w-full flex gap-2 items-center'>
            <p className={`text-lg w-2 ${category.textClass} font-bold`}>-</p>
            <div className='flex flex-col w-20'>
              <p className='text-lg whitespace-nowrap font-bold'>{category.name}</p>
              <p className='text-sm text-gray-500'>{category.challengeCount}개 챌린지</p>
            </div>
            <div className='flex-1 flex items-center gap-2'>
              <Progress
                className='flex-1'
                percent={progressPercent}
                showInfo={false}
                strokeColor={category.color}
                size='small'
              />
              <p className='text-md text-gray-600 w-12'>{progressPercent}%</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};
