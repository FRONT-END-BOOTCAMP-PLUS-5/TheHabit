"use client";

interface AddChallengeButtonProps {
  onClick: () => void;
}

const AddChallengeButton: React.FC<AddChallengeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-20 bg-primary text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg cursor-pointer hover:animate-float transition-all duration-300 hover:scale-110"
    >
      새 챌린지 시작하기
    </button>
  );
};

export default AddChallengeButton;
