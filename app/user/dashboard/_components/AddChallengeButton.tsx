'use client';

interface AddChallengeButtonProps {
  onClick: () => void;
}

const AddChallengeButton: React.FC<AddChallengeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className='bg-primary text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg cursor-pointer hover:animate-float transition-all duration-300 hover:scale-110'
    >
      새 챌린지 시작하기
    </button>
  );
};

export default AddChallengeButton;
