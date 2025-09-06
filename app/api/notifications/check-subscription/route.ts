import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrPushSubscriptionRepository } from '@/backend/notifications/infrastructure/repositories/PrPushSubscriptionRepository';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ isSubscribed: false });
    }

    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json({ isSubscribed: false });
    }

    const repository = new PrPushSubscriptionRepository();
    const subscription = await repository.findByEndpoint(endpoint);
    
    const isSubscribed = !!subscription && subscription.userId === session.user.id;
    
    return NextResponse.json({ isSubscribed });
  } catch (error) {
    console.error('구독 확인 오류:', error);
    return NextResponse.json({ isSubscribed: false });
  }
}