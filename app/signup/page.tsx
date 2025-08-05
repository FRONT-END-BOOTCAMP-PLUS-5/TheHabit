import { Suspense } from "react";
import SignUpFormClient from "./components/SignUpFormClient";

export default function SignUpPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <section className="w-full max-w-md justify-center">
        <Suspense fallback={<div>로딩 중...</div>}>
          <SignUpFormClient />
        </Suspense>
      </section>
    </main>
  );
}
