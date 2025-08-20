import { SignUpForm } from '@/app/signup/components/SignupForm';
import { SignUpTitle } from '@/app/signup/components/SignUpTitle';

export default function SignUpPage() {
  return (
    <main className='flex flex-col items-center justify-center w-full h-full'>
      <section className='w-full justify-center flex flex-col'>
        <SignUpTitle />
        <SignUpForm />
      </section>
    </main>
  );
}
