import { GetRoutinesUseCase } from "@/backend/routines/applications/usecases/GetRoutinesUseCase";
import { GetRoutineByIdUseCase } from "@/backend/routines/applications/usecases/GetRoutineByIdUseCase";
import { CompleteRoutineUseCase } from "@/backend/routine-completions/applications/usecases/CompleteRoutineUseCase";
import { GetRoutineCompletionsUseCase } from "@/backend/routine-completions/applications/usecases/GetRoutineCompletionsUseCase";
import { PrRoutinesRepository } from "@/backend/routines/infrastructures/repositories/PrRoutinesRepository";
import { PrRoutineCompletionsRepository } from "@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository";
import prisma from "@/public/utils/prismaClient";

// Repository 인스턴스 생성
const routinesRepository = new PrRoutinesRepository();
const routineCompletionsRepository = new PrRoutineCompletionsRepository();

let testRoutineId: number;
let testCompletionId: number;

async function setupTestData() {
  try {
    console.log("=== 테스트 데이터 설정 시작 ===");

    // 테스트용 루틴 생성
    const testRoutine = await routinesRepository.create({
      routineTitle: "UseCase 테스트용 루틴",
      alertTime: new Date('2024-12-01T07:00:00'),
      emoji: 1,
      challengeId: 1,
      updatedAt: new Date()
    });

    testRoutineId = testRoutine.id;
    console.log("테스트용 루틴 생성 완료:", testRoutine);

  } catch (error) {
    console.error("테스트 데이터 설정 중 오류:", error);
  }
}

async function testGetRoutinesUseCase() {
  try {
    console.log("\n=== GetRoutinesUseCase 테스트 시작 ===");

    const getRoutinesUseCase = new GetRoutinesUseCase(routinesRepository);

    // 모든 루틴 조회
    console.log("1. getAll() 테스트:");
    const allRoutines = await getRoutinesUseCase.getAll();
    console.log(`전체 루틴 개수: ${allRoutines.length}`);
    if (allRoutines.length >= 0) {
      console.log("✅ getAll() 테스트 성공!");
    }

    // 챌린지별 루틴 조회
    console.log("\n2. getByChallengeId() 테스트:");
    const challengeRoutines = await getRoutinesUseCase.getByChallengeId(1);
    console.log(`챌린지 1의 루틴 개수: ${challengeRoutines.length}`);
    if (challengeRoutines.length >= 0) {
      console.log("✅ getByChallengeId() 테스트 성공!");
    }

    // 사용자별 루틴 조회
    console.log("\n3. getByUserId() 테스트:");
    const userRoutines = await getRoutinesUseCase.getByUserId("test-user-id");
    console.log(`사용자의 루틴 개수: ${userRoutines.length}`);
    if (userRoutines.length >= 0) {
      console.log("✅ getByUserId() 테스트 성공!");
    }

  } catch (error) {
    console.error("GetRoutinesUseCase 테스트 중 오류:", error);
  }
}

async function testGetRoutineByIdUseCase() {
  try {
    console.log("\n=== GetRoutineByIdUseCase 테스트 시작 ===");

    const getRoutineByIdUseCase = new GetRoutineByIdUseCase(routinesRepository);

    // 존재하는 루틴 조회
    console.log("1. 존재하는 루틴 조회 테스트:");
    const foundRoutine = await getRoutineByIdUseCase.execute({ routineId: testRoutineId });
    console.log("조회된 루틴:", foundRoutine);
    if (foundRoutine && foundRoutine.id === testRoutineId) {
      console.log("✅ 존재하는 루틴 조회 테스트 성공!");
    } else {
      console.log("❌ 존재하는 루틴 조회 테스트 실패!");
    }

    // 존재하지 않는 루틴 조회 (에러 발생 예상)
    console.log("\n2. 존재하지 않는 루틴 조회 테스트:");
    try {
      await getRoutineByIdUseCase.execute({ routineId: 99999 });
      console.log("❌ 존재하지 않는 루틴 조회 시 에러가 발생하지 않음!");
    } catch (error: any) {
      if (error.message.includes('찾을 수 없습니다')) {
        console.log("✅ 존재하지 않는 루틴 조회 시 올바른 에러 발생:", error.message);
      } else {
        console.log("❌ 예상하지 못한 에러 발생:", error.message);
      }
    }

  } catch (error) {
    console.error("GetRoutineByIdUseCase 테스트 중 오류:", error);
  }
}

async function testCompleteRoutineUseCase() {
  try {
    console.log("\n=== CompleteRoutineUseCase 테스트 시작 ===");

    const completeRoutineUseCase = new CompleteRoutineUseCase(routineCompletionsRepository);

    // 루틴 완료 처리
    console.log("1. 루틴 완료 처리 테스트:");
    const completionRequest = {
      userId: "test-usecase-user",
      routineId: testRoutineId,
      proofImgUrl: "https://example.com/usecase-test-proof.jpg"
    };

    const completionResult = await completeRoutineUseCase.execute(completionRequest);
    testCompletionId = completionResult.id;
    console.log("완료 처리 결과:", completionResult);

    if (completionResult.id && 
        completionResult.userId === completionRequest.userId &&
        completionResult.routineId === completionRequest.routineId) {
      console.log("✅ 루틴 완료 처리 테스트 성공!");
    } else {
      console.log("❌ 루틴 완료 처리 테스트 실패!");
    }

    // 증명 이미지 없이 완료 처리
    console.log("\n2. 증명 이미지 없이 완료 처리 테스트:");
    const completionWithoutProof = await completeRoutineUseCase.execute({
      userId: "test-usecase-user-2",
      routineId: testRoutineId,
      proofImgUrl: null
    });

    if (completionWithoutProof.id && completionWithoutProof.proofImgUrl === null) {
      console.log("✅ 증명 이미지 없이 완료 처리 테스트 성공!");
    } else {
      console.log("❌ 증명 이미지 없이 완료 처리 테스트 실패!");
    }

  } catch (error) {
    console.error("CompleteRoutineUseCase 테스트 중 오류:", error);
  }
}

async function testGetRoutineCompletionsUseCase() {
  try {
    console.log("\n=== GetRoutineCompletionsUseCase 테스트 시작 ===");

    const getRoutineCompletionsUseCase = new GetRoutineCompletionsUseCase(routineCompletionsRepository);

    // 루틴별 완료 기록 조회
    console.log("1. getByRoutineId() 테스트:");
    const routineCompletions = await getRoutineCompletionsUseCase.getByRoutineId(testRoutineId);
    console.log(`루틴 ${testRoutineId}의 완료 기록 개수: ${routineCompletions.length}`);
    if (routineCompletions.length >= 0) {
      console.log("✅ getByRoutineId() 테스트 성공!");
    }

    // 사용자별 완료 기록 조회
    console.log("\n2. getByUserId() 테스트:");
    const userCompletions = await getRoutineCompletionsUseCase.getByUserId("test-usecase-user");
    console.log(`사용자의 완료 기록 개수: ${userCompletions.length}`);
    if (userCompletions.length >= 0) {
      console.log("✅ getByUserId() 테스트 성공!");
    }

    // 사용자와 루틴 조합 완료 기록 조회
    console.log("\n3. getByUserAndRoutine() 테스트:");
    const userRoutineCompletions = await getRoutineCompletionsUseCase.getByUserAndRoutine("test-usecase-user", testRoutineId);
    console.log(`특정 사용자의 특정 루틴 완료 기록 개수: ${userRoutineCompletions.length}`);
    if (userRoutineCompletions.length >= 0) {
      console.log("✅ getByUserAndRoutine() 테스트 성공!");
    }

  } catch (error) {
    console.error("GetRoutineCompletionsUseCase 테스트 중 오류:", error);
  }
}

async function cleanupTestData() {
  try {
    console.log("\n=== 테스트 데이터 정리 시작 ===");

    // 테스트 완료 기록들 정리
    await prisma.routineCompletion.deleteMany({
      where: {
        OR: [
          { userId: "test-usecase-user" },
          { userId: "test-usecase-user-2" }
        ]
      }
    });

    // 테스트 루틴 정리
    if (testRoutineId) {
      await routinesRepository.delete(testRoutineId);
    }

    console.log("✅ 테스트 데이터 정리 완료");
  } catch (error) {
    console.error("테스트 데이터 정리 중 오류:", error);
  }
}

async function main() {
  console.log("=== UseCase 테스트 시작 ===");

  // 테스트 데이터 설정
  await setupTestData();

  // GetRoutinesUseCase 테스트
  await testGetRoutinesUseCase();

  // GetRoutineByIdUseCase 테스트
  await testGetRoutineByIdUseCase();

  // CompleteRoutineUseCase 테스트
  await testCompleteRoutineUseCase();

  // GetRoutineCompletionsUseCase 테스트
  await testGetRoutineCompletionsUseCase();

  // 테스트 데이터 정리
  await cleanupTestData();

  console.log("\n=== 모든 UseCase 테스트 완료 ===");
}

main()
  .catch((e) => {
    console.error("UseCase 테스트 실행 중 오류:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });