import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const done = req.cookies.get('onboarding')?.value === 'done';
  return NextResponse.json({ done });
}
