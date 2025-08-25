import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupNullSubscriptions() {
  try {
    console.log('🔍 user_id가 null인 구독들을 찾는 중...');
    
    // user_id가 null인 구독들을 삭제
    const result = await prisma.$executeRaw`
      DELETE FROM push_subscriptions 
      WHERE user_id IS NULL
    `;
    
    console.log(`✅ ${result}개의 null user_id 구독을 삭제했습니다.`);
    
    // 전체 구독 개수 확인
    const totalSubscriptions = await prisma.pushSubscription.count();
    console.log(`📊 현재 총 구독 개수: ${totalSubscriptions}개`);
    
  } catch (error) {
    console.error('❌ 정리 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupNullSubscriptions();