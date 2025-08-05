import { PrChallengeRepository } from "@/backend/challenges/infrastructures/repositories/PrChallengeRepository";
import { Challenge } from "@/backend/challenges/domains/entities/ChallengeEntity";
import prisma from "@/public/utils/prismaClient";
import {PrUserRepository} from "@/backend/users/infrastructures/repositories/PrUserRepository";
import {User} from "@/backend/users/domains/entities/UserEntity";

let createdChallengeId: number;

async function testCreate() {
  const challengeRepository = new PrChallengeRepository();

  // 테스트용 챌린지 데이터 생성
  const testChallenge = new Challenge(
    0, // id는 데이터베이스에서 자동 생성
    "조현돈 챌린지!!!!",
    new Date('2024-12-01'),
    new Date('2024-12-31'),
    new Date('2024-12-01T09:00:00'),
    new Date('2024-12-01T10:00:00'),
    "#FF5733",
    "88b3e620-52d9-4a5c-bb2b-1dfc9a2d1a10",
    2
  );

  try {
    console.log("=== CREATE 테스트 시작 ===");
    console.log("생성할 챌린지:", testChallenge);

    // 챌린지 생성
    const createdChallenge = await challengeRepository.create(testChallenge);
    createdChallengeId = createdChallenge.id; // 다른 테스트에서 사용하기 위해 저장
    console.log("생성된 챌린지:", createdChallenge);

    // 생성된 챌린지가 올바른지 확인
    if (createdChallenge.id && createdChallenge.name === testChallenge.name) {
      console.log("✅ CREATE 테스트 성공!");
    } else {
      console.log("❌ CREATE 테스트 실패!");
    }

    // 생성된 챌린지를 ID로 조회해서 확인
    const foundChallenge = await challengeRepository.findById(createdChallenge.id);
    if (foundChallenge) {
      console.log("✅ 생성된 챌린지 조회 성공:", foundChallenge);
    } else {
      console.log("❌ 생성된 챌린지 조회 실패!");
    }

  } catch (error) {
    console.error("CREATE 테스트 중 오류 발생:", error);
  }
}

async function testFindById() {
  const challengeRepository = new PrChallengeRepository();

  try {
    console.log("\n=== FIND BY ID 테스트 시작 ===");

    // 존재하는 ID로 조회
    const foundChallenge = await challengeRepository.findById(createdChallengeId);
    if (foundChallenge) {
      console.log("✅ 존재하는 ID 조회 성공:", foundChallenge);
    } else {
      console.log("❌ 존재하는 ID 조회 실패!");
    }

    // 존재하지 않는 ID로 조회
    const notFoundChallenge = await challengeRepository.findById(99999);
    if (!notFoundChallenge) {
      console.log("✅ 존재하지 않는 ID 조회 성공 (null 반환)");
    } else {
      console.log("❌ 존재하지 않는 ID 조회 실패!");
    }

  } catch (error) {
    console.error("FIND BY ID 테스트 중 오류 발생:", error);
  }
}

async function testFindByUserId() {
  const challengeRepository = new PrChallengeRepository();

  try {
    console.log("\n=== FIND BY USER ID 테스트 시작 ===");

    const userId = "88b3e620-52d9-4a5c-bb2b-1dfc9a2d1a10";
    const userChallenges = await challengeRepository.findByUserId(userId);

    console.log(`사용자 ${userId}의 챌린지 개수:`, userChallenges.length);
    console.log("사용자의 챌린지 목록:", userChallenges);

    if (userChallenges.length > 0) {
      console.log("✅ FIND BY USER ID 테스트 성공!");
    } else {
      console.log("❌ FIND BY USER ID 테스트 실패!");
    }

  } catch (error) {
    console.error("FIND BY USER ID 테스트 중 오류 발생:", error);
  }
}

async function testFindByCategoryId() {
  const challengeRepository = new PrChallengeRepository();

  try {
    console.log("\n=== FIND BY CATEGORY ID 테스트 시작 ===");

    const categoryId = 2;
    const categoryChallenges = await challengeRepository.findByCategoryId(categoryId);

    console.log(`카테고리 ${categoryId}의 챌린지 개수:`, categoryChallenges.length);
    console.log("카테고리의 챌린지 목록:", categoryChallenges);

    if (categoryChallenges.length > 0) {
      console.log("✅ FIND BY CATEGORY ID 테스트 성공!");
    } else {
      console.log("❌ FIND BY CATEGORY ID 테스트 실패!");
    }

  } catch (error) {
    console.error("FIND BY CATEGORY ID 테스트 중 오류 발생:", error);
  }
}

async function testUserCreate(){
  const userRepository = new PrUserRepository();
}

async function testUpdate() {
  const challengeRepository = new PrChallengeRepository();

  try {
    console.log("\n=== UPDATE 테스트 시작 ===");

    // 업데이트할 데이터
    const updateData = {
      name: "업데이트된 조현돈 챌린지!!!!",
      color: "#00FF00"
    };

    console.log("업데이트할 데이터:", updateData);

    // 챌린지 업데이트
    const updatedChallenge = await challengeRepository.update(createdChallengeId, updateData);

    if (updatedChallenge && updatedChallenge.name === updateData.name && updatedChallenge.color === updateData.color) {
      console.log("✅ UPDATE 테스트 성공!");
      console.log("업데이트된 챌린지:", updatedChallenge);
    } else {
      console.log("❌ UPDATE 테스트 실패!");
    }

  } catch (error) {
    console.error("UPDATE 테스트 중 오류 발생:", error);
  }
}

/*
async function testDelete() {
  const challengeRepository = new PrChallengeRepository();

  try {
    console.log("\n=== DELETE 테스트 시작 ===");

    // 삭제 전에 챌린지가 존재하는지 확인
    const beforeDelete = await challengeRepository.findById(createdChallengeId);
    console.log("삭제 전 챌린지:", beforeDelete);

    // 챌린지 삭제
    const deleteResult = await challengeRepository.delete(createdChallengeId);

    if (deleteResult) {
      console.log("✅ DELETE 테스트 성공!");

      // 삭제 후에 챌린지가 존재하지 않는지 확인
      const afterDelete = await challengeRepository.findById(createdChallengeId);
      if (!afterDelete) {
        console.log("✅ 삭제 후 조회 시 null 반환 확인!");
      } else {
        console.log("❌ 삭제 후에도 챌린지가 존재함!");
      }
    } else {
      console.log("❌ DELETE 테스트 실패!");
    }

  } catch (error) {
    console.error("DELETE 테스트 중 오류 발생:", error);
  }
}

async function testDeleteByUserId() {
  const challengeRepository = new PrChallengeRepository();

  try {
    console.log("\n=== DELETE BY USER ID 테스트 시작 ===");

    // 먼저 테스트용 챌린지를 다시 생성
    const testChallenge = new Challenge(
      0,
      "삭제 테스트용 챌린지",
      new Date('2024-12-01'),
      new Date('2024-12-31'),
      null,
      null,
      "#FF0000",
      "delete-test-user-id",
      1
    );

    const createdChallenge = await challengeRepository.create(testChallenge);
    console.log("삭제 테스트용 챌린지 생성:", createdChallenge);

    // 해당 사용자의 챌린지 개수 확인
    const beforeDelete = await challengeRepository.findByUserId("delete-test-user-id");
    console.log("삭제 전 사용자의 챌린지 개수:", beforeDelete.length);

    // 사용자의 모든 챌린지 삭제
    const deleteResult = await challengeRepository.deleteByUserId("delete-test-user-id");

    if (deleteResult) {
      console.log("✅ DELETE BY USER ID 테스트 성공!");

      // 삭제 후 사용자의 챌린지 개수 확인
      const afterDelete = await challengeRepository.findByUserId("delete-test-user-id");
      console.log("삭제 후 사용자의 챌린지 개수:", afterDelete.length);

      if (afterDelete.length === 0) {
        console.log("✅ 사용자의 모든 챌린지가 삭제됨!");
      } else {
        console.log("❌ 사용자의 챌린지가 완전히 삭제되지 않음!");
      }
    } else {
      console.log("❌ DELETE BY USER ID 테스트 실패!");
    }

  } catch (error) {
    console.error("DELETE BY USER ID 테스트 중 오류 발생:", error);
  }
}
*/

async function testFindAll() {
  const challengeRepository = new PrChallengeRepository();
  const challenges = await challengeRepository.findAll();
  console.log("\n=== FINDALL 테스트 ===");
  console.log("전체 챌린지 개수:", challenges.length);
  console.log("전체 챌린지 목록:", challenges);
}

async function main() {
  console.log("=== PrChallengeRepository 테스트 시작 ===");

  // CREATE 테스트
  await testCreate();

  // FIND BY ID 테스트
  await testFindById();

  // FIND BY USER ID 테스트
  await testFindByUserId();

  // FIND BY CATEGORY ID 테스트
  await testFindByCategoryId();

  // UPDATE 테스트
  await testUpdate();

  // DELETE 테스트
  // await testDelete();

  // DELETE BY USER ID 테스트
  // await testDeleteByUserId();

  // FINDALL 테스트
  await testFindAll();
}

main()
  .catch((e) => {
    console.error("테스트 실행 중 오류:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });