'use client';
const NoneImg = ({
  width = 'auto',
  height = '100%',
  rounded,
}: {
  width?: string;
  height?: string;
  rounded?: string;
}) => {
  return (
    <div
      className={`w-[${width}] h-[${height}] ${rounded ? `rounded-[${rounded}]` : ''} text-center font-semibold bg-gradient-to-r from-[#84fab0] to-[#8fd3f4] flex items-center justify-center text-[#fff]`}
    >
      <p>
        루틴 완료한 해당
        <br /> 📸사진이 없어요..
      </p>
    </div>
  );
};

export default NoneImg;
