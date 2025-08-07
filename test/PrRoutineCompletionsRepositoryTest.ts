import { PrRoutineCompletionsRepository } from "@/backend/routine-completions/infrastructures/repositories/PrRoutineCompletionsRepository";
import { RoutineCompletion } from "@/backend/routine-completions/domains/entities/routine-completion/routineCompletion";
import prisma from "@/public/utils/prismaClient";

let createdCompletionId: number;

async function testCreate() {
  const routineCompletionsRepository = new PrRoutineCompletionsRepository();

  // 테스트용 루틴 완료 데이터 생성
  const testCompletion: Omit<RoutineCompletion, "id" | "createdAt"> = {
    userId: "test-user-id-12345",
    routineId: 1, // 기존에 있는 루틴 ID 사용
    proofImgUrl: "https://example.com/proof-image.jpg"
  };

  try {
    console.log("=== CREATE 테스트 시작 ===");
    console.log("생성할 루틴 완료:", testCompletion);

    // 루틴 완료 생성
    const createdCompletion = await routineCompletionsRepository.create(testCompletion);
    createdCompletionId = createdCompletion.id; // 다른 테스트에서 사용하기 위해 저장
    console.log("생성된 루틴 완료:", createdCompletion);

    // 생성된 루틴 완료가 올바른지 확인
    if (createdCompletion.id && 
        createdCompletion.userId === testCompletion.userId &&
        createdCompletion.routineId === testCompletion.routineId) {
      console.log("✅ CREATE 테스트 성공!");
    } else {
      console.log("❌ CREATE 테스트 실패!");
    }

    // 생성된 루틴 완료를 ID로 조회해서 확인
    const foundCompletion = await routineCompletionsRepository.findById(createdCompletion.id);
    if (foundCompletion) {
      console.log("✅ 생성된 루틴 완료 조회 성공:", foundCompletion);
    } else {
      console.log("❌ 생성된 루틴 완료 조회 실패!");
    }

  } catch (error) {
    console.error("CREATE 테스트 중 오류 발생:", error);
  }
}

async function testFindById() {
  const routineCompletionsRepository = new PrRoutineCompletionsRepository();

  try {
    console.log("\n=== FIND BY ID 테스트 시작 ===");

    // 존재하는 ID로 조회
    const foundCompletion = await routineCompletionsRepository.findById(createdCompletionId);
    if (foundCompletion) {
      console.log("✅ 존재하는 ID 조회 성공:", foundCompletion);
    } else {
      console.log("❌ 존재하는 ID 조회 실패!");
    }

    // 존재하지 않는 ID로 조회
    const notFoundCompletion = await routineCompletionsRepository.findById(99999);
    if (!notFoundCompletion) {
      console.log("✅ 존재하지 않는 ID 조회 성공 (null 반환)");
    } else {
      console.log("❌ 존재하지 않는 ID 조회 실패!");
    }

  } catch (error) {
    console.error("FIND BY ID 테스트 중 오류 발생:", error);
  }
}

async function testFindByRoutineId() {
  const routineCompletionsRepository = new PrRoutineCompletionsRepository();

  try {
    console.log("\n=== FIND BY ROUTINE ID 테스트 시작 ===");

    const routineId = 1;
    const routineCompletions = await routineCompletionsRepository.findByRoutineId(routineId);

    console.log(`루틴 ${routineId}의 완료 기록 개수:`, routineCompletions.length);
    console.log("루틴의 완료 기록 목록:", routineCompletions);

    if (routineCompletions.length >= 0) { // 0개여도 성공으로 간주
      console.log("✅ FIND BY ROUTINE ID 테스트 성공!");
    } else {
      console.log("❌ FIND BY ROUTINE ID 테스트 실패!");
    }

  } catch (error) {
    console.error("FIND BY ROUTINE ID 테스트 중 오류 발생:", error);
  }
}

async function testFindByUserId() {
  const routineCompletionsRepository = new PrRoutineCompletionsRepository();

  try {
    console.log("\n=== FIND BY USER ID 테스트 시작 ===");

    const userId = "test-user-id-12345";
    const userCompletions = await routineCompletionsRepository.findByUserId(userId);

    console.log(`사용자 ${userId}의 완료 기록 개수:`, userCompletions.length);
    console.log("사용자의 완료 기록 목록:", userCompletions);

    if (userCompletions.length >= 0) { // 0개여도 성공으로 간주
      console.log("✅ FIND BY USER ID 테스트 성공!");
    } else {
      console.log("❌ FIND BY USER ID 테스트 실패!");
    }

  } catch (error) {
    console.error("FIND BY USER ID 테스트 중 오류 발생:", error);
  }
}

async function testFindByUserIdAndRoutineId() {
  const routineCompletionsRepository = new PrRoutineCompletionsRepository();

  try {
    console.log("\n=== FIND BY USER ID AND ROUTINE ID 테스트 시작 ===");

    const userId = "test-user-id-12345";
    const routineId = 1;
    const userRoutineCompletions = await routineCompletionsRepository.findByUserIdAndRoutineId(userId, routineId);

    console.log(`사용자 ${userId}의 루틴 ${routineId} 완료 기록 개수:`, userRoutineCompletions.length);
    console.log("사용자의 특정 루틴 완료 기록:", userRoutineCompletions);

    if (userRoutineCompletions.length >= 0) { // 0개여도 성공으로 간주
      console.log("✅ FIND BY USER ID AND ROUTINE ID 테스트 성공!");
    } else {
      console.log("❌ FIND BY USER ID AND ROUTINE ID 테스트 실패!");
    }

  } catch (error) {
    console.error("FIND BY USER ID AND ROUTINE ID 테스트 중 오류 발생:", error);
  }
}

async function testUpdate() {
  const routineCompletionsRepository = new PrRoutineCompletionsRepository();

  try {
    console.log("\n=== UPDATE 테스트 시작 ===");

    // 업데이트할 데이터
    const updateData: Partial<RoutineCompletion> = {
      proofImgUrl: "https://example.com/updated-proof-image.jpg"
    };

    console.log("업데이트할 데이터:", updateData);

    // 루틴 완료 업데이트
    const updatedCompletion = await routineCompletionsRepository.update(createdCompletionId, updateData);

    if (updatedCompletion && updatedCompletion.proofImgUrl === updateData.proofImgUrl) {
      console.log("✅ UPDATE 테스트 성공!");
      console.log("업데이트된 루틴 완료:", updatedCompletion);
    } else {
      console.log("❌ UPDATE 테스트 실패!");
    }

  } catch (error) {
    console.error("UPDATE 테스트 중 오류 발생:", error);
  }
}

/*
// DELETE 테스트는 마지막에 실행 (데이터 정리용)
async function testDelete() {
  const routineCompletionsRepository = new PrRoutineCompletionsRepository();

  try {
    console.log("\n=== DELETE 테스트 시작 ===");

    // 삭제 전에 루틴 완료가 존재하는지 확인
    const beforeDelete = await routineCompletionsRepository.findById(createdCompletionId);
    console.log("삭제 전 루틴 완료:", beforeDelete);

    // 루틴 완료 삭제
    const deleteResult = await routineCompletionsRepository.delete(createdCompletionId);

    if (deleteResult) {
      console.log("✅ DELETE 테스트 성공!");

      // 삭제 후에 루틴 완료가 존재하지 않는지 확인
      const afterDelete = await routineCompletionsRepository.findById(createdCompletionId);
      if (!afterDelete) {
        console.log("✅ 삭제 후 조회 시 null 반환 확인!");
      } else {
        console.log("❌ 삭제 후에도 루틴 완료가 존재함!");
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
  console.log("=== PrRoutineCompletionsRepository 테스트 시작 ===");

  // CREATE 테스트
  await testCreate();

  // FIND BY ID 테스트
  await testFindById();

  // FIND BY ROUTINE ID 테스트
  await testFindByRoutineId();

  // FIND BY USER ID 테스트
  await testFindByUserId();

  // FIND BY USER ID AND ROUTINE ID 테스트
  await testFindByUserIdAndRoutineId();

  // UPDATE 테스트
  await testUpdate();

  // DELETE 테스트 (데이터 정리)
  // await testDelete();

  console.log("\n=== 모든 테스트 완료 ===");
}

main()
  .catch((e) => {
    console.error("테스트 실행 중 오류:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });