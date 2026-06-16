export type OnboardingStatus = {
  done: boolean;
  redirectTo: string | null;
};

export async function fetchOnboardingStatus(): Promise<OnboardingStatus> {
  try {
    const res = await fetch('/api/onboarding/status');
    if (!res.ok) return { done: false, redirectTo: null };
    const data = (await res.json()) as { done?: boolean; redirectTo?: string | null };
    return {
      done: data.done === true,
      redirectTo: data.redirectTo ?? null,
    };
  } catch {
    return { done: false, redirectTo: null };
  }
}
