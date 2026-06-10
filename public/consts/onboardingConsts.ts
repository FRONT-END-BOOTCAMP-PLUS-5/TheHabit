export async function fetchOnboardingStatus(): Promise<boolean> {
  try {
    const res = await fetch('/api/onboarding/status');
    if (!res.ok) return false;
    const data = (await res.json()) as { done?: boolean };
    return data.done === true;
  } catch {
    return false;
  }
}
