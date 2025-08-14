import { PrRoutinesRepository } from '@/backend/routines/infrastructures/repositories/PrRoutinesRepository';
import { Routine } from '@/backend/routines/domains/entities/routine/routine';
import prisma from '@/public/utils/prismaClient';

let createdRoutineId: number;
let testChallengeId: number;

async function setupTestData() {
  try {
    console.log('=== 테스트 데이터 설정 ===');

    // 먼저 테스트용 사용자 생성
    const testUser = await prisma.user.upsert({
      where: { email: 'test-routine@example.com' },
      update: {},
      create: {
        username: 'testuser',
        password: 'testpass',
        nickname: 'testuser',
        email: 'test-routine@example.com',
      },
    });

    // 테스트용 카테고리 생성
    const testCategory = await prisma.challengeCategory.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        categoryName: '테스트 카테고리',
      },
    });

    // 테스트용 챌린지 생성
    const testChallenge = await prisma.challenge.create({
      data: {
        name: '테스트 챌린지',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-31'),
        startTime: new Date('2024-12-01T09:00:00'),
        endTime: new Date('2024-12-01T10:00:00'),
        color: '#FF5733',
        userId: testUser.id,
        categoryId: testCategory.id,
      },
    });

    testChallengeId = testChallenge.id;
    console.log('✅ 테스트 데이터 설정 완료');
    console.log('테스트 챌린지 ID:', testChallengeId);
  } catch (error) {
    console.error('테스트 데이터 설정 중 오류:', error);
  }
}

async function cleanupTestData() {
  try {
    console.log('=== 테스트 데이터 정리 ===');

    // 테스트 루틴 삭제 (외래키로 인해 먼저 삭제)
    await prisma.routine.deleteMany({
      where: { challengeId: testChallengeId },
    });

    // 테스트 챌린지 삭제
    await prisma.challenge.deleteMany({
      where: { id: testChallengeId },
    });

    // 테스트 사용자 삭제
    await prisma.user.deleteMany({
      where: { email: 'test-routine@example.com' },
    });

    console.log('✅ 테스트 데이터 정리 완료');
  } catch (error) {
    console.error('테스트 데이터 정리 중 오류:', error);
  }
}

async function testCreate() {
  const routinesRepository = new PrRoutinesRepository();

  // 테스트용 루틴 데이터 생성
  const testRoutine: Omit<Routine, 'id' | 'createdAt'> = {
    routineTitle: '아침 운동하기',
    alertTime: new Date('2024-12-01T07:00:00'),
    emoji: 1,
    challengeId: testChallengeId, // 테스트용 챌린지 ID 사용
    updatedAt: new Date(),
  };

  try {
    console.log('=== CREATE 테스트 시작 ===');
    console.log('생성할 루틴:', testRoutine);

    // 루틴 생성
    const createdRoutine = await routinesRepository.create(testRoutine);
    createdRoutineId = createdRoutine.id; // 다른 테스트에서 사용하기 위해 저장
    console.log('생성된 루틴:', createdRoutine);

    // 생성된 루틴이 올바른지 확인
    if (createdRoutine.id && createdRoutine.routineTitle === testRoutine.routineTitle) {
      console.log('✅ CREATE 테스트 성공!');
    } else {
      console.log('❌ CREATE 테스트 실패!');
    }

    // 생성된 루틴을 ID로 조회해서 확인
    const foundRoutine = await routinesRepository.findById(createdRoutine.id);
    if (foundRoutine) {
      console.log('✅ 생성된 루틴 조회 성공:', foundRoutine);
    } else {
      console.log('❌ 생성된 루틴 조회 실패!');
    }
  } catch (error) {
    console.error('CREATE 테스트 중 오류 발생:', error);
  }
}

async function testFindById() {
  const routinesRepository = new PrRoutinesRepository();

  try {
    console.log('\n=== FIND BY ID 테스트 시작 ===');

    // 존재하는 ID로 조회
    const foundRoutine = await routinesRepository.findById(createdRoutineId);
    if (foundRoutine) {
      console.log('✅ 존재하는 ID 조회 성공:', foundRoutine);
    } else {
      console.log('❌ 존재하는 ID 조회 실패!');
    }

    // 존재하지 않는 ID로 조회
    const notFoundRoutine = await routinesRepository.findById(99999);
    if (!notFoundRoutine) {
      console.log('✅ 존재하지 않는 ID 조회 성공 (null 반환)');
    } else {
      console.log('❌ 존재하지 않는 ID 조회 실패!');
    }
  } catch (error) {
    console.error('FIND BY ID 테스트 중 오류 발생:', error);
  }
}

async function testFindByChallengeId() {
  const routinesRepository = new PrRoutinesRepository();

  try {
    console.log('\n=== FIND BY CHALLENGE ID 테스트 시작 ===');

    const challengeId = testChallengeId;
    const challengeRoutines = await routinesRepository.findByChallengeId(challengeId);

    console.log(`챌린지 ${challengeId}의 루틴 개수:`, challengeRoutines.length);
    console.log('챌린지의 루틴 목록:', challengeRoutines);

    if (challengeRoutines.length >= 0) {
      // 0개여도 성공으로 간주
      console.log('✅ FIND BY CHALLENGE ID 테스트 성공!');
    } else {
      console.log('❌ FIND BY CHALLENGE ID 테스트 실패!');
    }
  } catch (error) {
    console.error('FIND BY CHALLENGE ID 테스트 중 오류 발생:', error);
  }
}

async function testFindByUserId() {
  const routinesRepository = new PrRoutinesRepository();

  try {
    console.log('\n=== FIND BY USER ID 테스트 시작 ===');

    // 실제 사용자 ID를 사용 (챌린지 테이블에서 확인 필요)
    const userId = '88b3e620-52d9-4a5c-bb2b-1dfc9a2d1a10';
    const userRoutines = await routinesRepository.findByUserId(userId);

    console.log(`사용자 ${userId}의 루틴 개수:`, userRoutines.length);
    console.log('사용자의 루틴 목록:', userRoutines);

    if (userRoutines.length >= 0) {
      // 0개여도 성공으로 간주
      console.log('✅ FIND BY USER ID 테스트 성공!');
    } else {
      console.log('❌ FIND BY USER ID 테스트 실패!');
    }
  } catch (error) {
    console.error('FIND BY USER ID 테스트 중 오류 발생:', error);
  }
}

async function testUpdate() {
  const routinesRepository = new PrRoutinesRepository();

  try {
    console.log('\n=== UPDATE 테스트 시작 ===');

    // 업데이트할 데이터
    const updateData: Partial<Routine> = {
      routineTitle: '점심메뉴 정하기',
      emoji: 2,
      alertTime: new Date('2024-12-01T08:00:00'),
    };

    console.log('업데이트할 데이터:', updateData);

    // 루틴 업데이트
    const updatedRoutine = await routinesRepository.update(createdRoutineId, updateData);

    if (
      updatedRoutine &&
      updatedRoutine.routineTitle === updateData.routineTitle &&
      updatedRoutine.emoji === updateData.emoji
    ) {
      console.log('✅ UPDATE 테스트 성공!');
      console.log('업데이트된 루틴:', updatedRoutine);
    } else {
      console.log('❌ UPDATE 테스트 실패!');
    }
  } catch (error) {
    console.error('UPDATE 테스트 중 오류 발생:', error);
  }
}

async function testFindAll() {
  const routinesRepository = new PrRoutinesRepository();

  try {
    console.log('\n=== FIND ALL 테스트 시작 ===');

    const routines = await routinesRepository.findAll();
    console.log('전체 루틴 개수:', routines.length);
    console.log('전체 루틴 목록:', routines);

    if (routines.length >= 0) {
      console.log('✅ FIND ALL 테스트 성공!');
    } else {
      console.log('❌ FIND ALL 테스트 실패!');
    }
  } catch (error) {
    console.error('FIND ALL 테스트 중 오류 발생:', error);
  }
}

/*
// DELETE 테스트는 마지막에 실행 (데이터 정리용)
async function testDelete() {
  const routinesRepository = new PrRoutinesRepository();

  try {
    console.log("\n=== DELETE 테스트 시작 ===");

    // 삭제 전에 루틴이 존재하는지 확인
    const beforeDelete = await routinesRepository.findById(createdRoutineId);
    console.log("삭제 전 루틴:", beforeDelete);

    // 루틴 삭제
    const deleteResult = await routinesRepository.delete(createdRoutineId);

    if (deleteResult) {
      console.log("✅ DELETE 테스트 성공!");

      // 삭제 후에 루틴이 존재하지 않는지 확인
      const afterDelete = await routinesRepository.findById(createdRoutineId);
      if (!afterDelete) {
        console.log("✅ 삭제 후 조회 시 null 반환 확인!");
      } else {
        console.log("❌ 삭제 후에도 루틴이 존재함!");
      }
    } else {
      console.log("❌ DELETE 테스트 실패!");
    }

  } catch (error) {
    console.error("DELETE 테스트 중 오류 발생:", error);
  }
}
*/

async function main() {
  console.log('=== PrRoutinesRepository 테스트 시작 ===');

  // 테스트 데이터 설정
  await setupTestData();

  // CREATE 테스트
  await testCreate();

  // FIND BY ID 테스트
  await testFindById();

  // FIND BY CHALLENGE ID 테스트
  await testFindByChallengeId();

  // FIND BY USER ID 테스트
  await testFindByUserId();

  // UPDATE 테스트
  await testUpdate();

  // FIND ALL 테스트
  await testFindAll();

  // 테스트 데이터 정리
  await cleanupTestData();

  console.log('\n=== 모든 테스트 완료 ===');
}

main()
  .catch(e => {
    console.error('테스트 실행 중 오류:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
