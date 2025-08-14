import { LoginForm } from '@/app/login/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className='w-full h-full flex'>
      <Link href='/' className='text-3xl font-bold absolute left-2.5 top-2.5'>
        더: 해빛
      </Link>
      <section className='flex flex-col items-center w-full h-11/12 absolute bottom-0'>
        <h1 className='text-4xl font-bold'>로그인</h1>
        <LoginForm />
        <p className='text-md text-center gap-2 flex absolute bottom-1/6'>
          아직 회원이 아니신가요?
          <Link href='/signup' className='text-[#34A853] font-bold'>
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
