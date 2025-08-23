export const FeedBackSkeleton = () => {
  return (
    <section className='flex flex-col mt-10 w-full'>
      <div className='flex flex-col gap-10 w-6/7 mx-auto'>
        {/* FeedBackStatistics 스켈레톤 */}
        <div className='w-full mt-10 h-full p-2 rounded-lg shadow-md'>
          <div className='p-4'>
            {/* 챌린지 제목 스켈레톤 */}

            {/* 21일 그리드 스켈레톤 */}
            <div className='text-center grid gap-6 grid-cols-7'>
              {Array.from({ length: 21 }, (_, index) => (
                <div key={index} className='w-5 h-5 bg-gray-200 rounded-full animate-pulse'></div>
              ))}
            </div>
          </div>

          {/* 스와이퍼 페이지네이션 스켈레톤 */}
          <div className='flex justify-center mt-4 gap-2'>
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className='w-3 h-3 bg-gray-200 rounded-full animate-pulse'></div>
            ))}
          </div>
        </div>

        {/* FeedBackCategoryProgress 스켈레톤 */}
        <div className='w-full mt-12 p-4 rounded-lg shadow-md'>
          <div className='space-y-6'>
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-4 h-4 bg-gray-200 rounded animate-pulse'></div>
                  <div className='h-4 bg-gray-200 rounded w-20 animate-pulse'></div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-32 h-2 bg-gray-200 rounded animate-pulse'></div>
                  <div className='h-4 bg-gray-200 rounded w-12 animate-pulse'></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FeedBackBarChart 스켈레톤 */}
        <div className='w-full p-4 rounded-lg shadow-md'>
          <div className='h-6 bg-gray-200 rounded mb-4 w-1/4 animate-pulse'></div>

          {/* 차트 영역 스켈레톤 */}
          <div className='h-64 bg-gray-100 rounded relative'>
            {/* Y축 레이블들 */}
            <div className='absolute left-2 top-4 space-y-8'>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className='h-3 w-6 bg-gray-200 rounded animate-pulse'></div>
              ))}
            </div>

            {/* 바차트 바들 */}
            <div className='absolute bottom-8 left-12 right-4 flex items-end justify-around gap-2'>
              {[100, 80, 60, 90, 70].map((height, index) => (
                <div key={index} className='flex flex-col items-center gap-2'>
                  {/* 바 2개 (total, active) */}
                  <div className='flex gap-1'>
                    <div
                      className='w-6 bg-gray-200 rounded animate-pulse'
                      style={{ height: `${height}px` }}
                    ></div>
                    <div
                      className='w-6 bg-gray-300 rounded animate-pulse'
                      style={{ height: `${height * 0.7}px` }}
                    ></div>
                  </div>
                  {/* X축 레이블 */}
                  <div className='h-3 w-12 bg-gray-200 rounded animate-pulse'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
