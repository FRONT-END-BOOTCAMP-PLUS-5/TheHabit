const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDB() {
  try {
    console.log('🔍 데이터베이스 연결 테스트...');
    
    // Push subscriptions 테이블 데이터 개수 확인
    const count = await prisma.pushSubscription.count();
    console.log(`📊 push_subscriptions 테이블 데이터 개수: ${count}`);
    
    // 테이블 구조 확인을 위해 첫 번째 레코드 조회 (있다면)
    if (count > 0) {
      const first = await prisma.pushSubscription.findFirst();
      console.log('📋 첫 번째 레코드:', first);
    } else {
      console.log('📭 테이블이 비어있습니다.');
    }
    
    // User 테이블도 확인
    const userCount = await prisma.user.count();
    console.log(`👥 users 테이블 데이터 개수: ${userCount}`);
    
    console.log('✅ 데이터베이스 연결 성공!');
  } catch (error) {
    console.error('🚨 데이터베이스 연결 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();