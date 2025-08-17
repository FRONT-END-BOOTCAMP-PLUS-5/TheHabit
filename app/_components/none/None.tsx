'use client';

const None = ({ userId }: { userId: string }) => {
  return (
    <div className='flex items-center justify-center text-center h-[450px] text-gray-500'>
      {userId === 'edit' ? (
        <p>
          😘 에디터 페이지에서는 <br /> 카테고리에 해당하는 루틴을 <br />
          불러올 수 없습니다~
        </p>
      ) : (
        <p>
          🧐 이런..이런.. <br /> 카테고리에 해당하는 루틴을 <br />
          완료하신적이 없으시군요!
          <br />자 그럼 이번기회에 한번 해볼까요?
        </p>
      )}
    </div>
  );
};
export default None;
