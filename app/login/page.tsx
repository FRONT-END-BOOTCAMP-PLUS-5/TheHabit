import { LoginForm } from '@/app/login/_components/LoginForm';

export default function LoginPage() {
  return (
    <main className='w-full h-full flex'>
      <section className='flex flex-col items-center w-full h-11/12 bottom-0'>
        <h1 className='text-4xl font-bold mt-6 mb-6'>로그인</h1>
        <LoginForm />
      </section>
    </main>
  );
}
