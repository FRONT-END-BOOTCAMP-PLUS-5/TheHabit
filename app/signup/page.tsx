import { SignUpForm } from "@/app/signup/components/SignupForm";
import { SignUpTitle } from "@/app/signup/components/SignUpTitle";

export default function SignUpPage() {
  return (
    <main className="flex flex-col w-full h-full bg-gray-50">
      <section className="w-full h-full justify-center relative">
        <SignUpTitle />
        <SignUpForm />
      </section>
    </main>
  );
}
