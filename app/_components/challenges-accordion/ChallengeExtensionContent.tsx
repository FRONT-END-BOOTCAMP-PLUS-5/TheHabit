interface ChallengeExtensionContentProps {
  challengeName: string;
  onExtend: () => void;
  onComplete: () => void;
}

export default function ChallengeExtensionContent({
  challengeName,
  onExtend,
  onComplete,
}: ChallengeExtensionContentProps) {
  return (
    <div className='text-center py-4'>
      <div className='mb-6'>
        <h3 className='text-xl font-bold text-gray-800 mb-3'>🎉 21일 챌린지 완료!</h3>
        <p className='text-gray-600'>
          <span className='font-semibold text-blue-600'>{challengeName}</span> 챌린지를
          <span className='text-yellow-500 font-bold'> 66일 챌린지</span>로 연장하시겠습니까?
        </p>
      </div>

      <div className='flex gap-3 justify-center'>
        <button
          onClick={onExtend}
          className='px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 font-semibold transition-all duration-200'
        >
          🚀 66일로 연장하기
        </button>
        <button
          onClick={onComplete}
          className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-all duration-200'
        >
          완료하고 종료하기
        </button>
      </div>
    </div>
  );
}
