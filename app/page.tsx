export default function Home() {
  return (
    <main className='flex flex-col items-center justify-between min-h-screen bg-white px-6 py-8'>
      <div className='flex flex-col items-center justify-center flex-1 text-center'>
        <h1 className='text-[40px] font-bold text-gray-900 mb-6'>The Habit</h1>
        <p className='text-[20px] text-gray-600 leading-relaxed'>새로운 습관을 만들어보세요</p>
        <a
          href='/login'
          className='mt-8 w-full max-w-xs text-lg font-semibold text-white bg-lime-500 hover:bg-lime-600 transition-colors duration-200 rounded-xl h-14 flex items-center justify-center'
        >
          시작하기
        </a>
      </div>
    </main>
  );
}
