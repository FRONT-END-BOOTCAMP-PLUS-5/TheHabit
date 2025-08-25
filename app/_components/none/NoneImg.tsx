'use client';
const NoneImg = ({
  width = 'auto',
  height = '100%',
  rounded,
  content,
  type,
}: {
  width?: string;
  height?: string;
  rounded?: string;
  type?: boolean;
  content?: string;
}) => {
  return (
    <div
      className={`${rounded ? `rounded-${rounded}` : ''} text-center font-semibold bg-gradient-to-r from-[#84fab0] to-[#8fd3f4] flex items-center justify-center text-[#fff]`}
      style={{ width, height }}
    >
      {type && (
        <>
          <p className='max-w-[120px] break-all'>
            {content}
            <br />
            루틴
            <br /> 📸사진이 없어요..
          </p>
        </>
      )}
    </div>
  );
};

export default NoneImg;
