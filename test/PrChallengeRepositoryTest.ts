import { PrChallengeRepository } from "@/backend/challenges/infrastructures/repositories/PrChallengeRepository";
import { Challenge } from "@/backend/challenges/domains/entities/ChallengeEntity";
import prisma from "@/public/utils/prismaClient";

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

async function testFindAll() {
  const challengeRepository = new PrChallengeRepository();
  const challenges = await challengeRepository.findAll();
  console.log("=== FINDALL 테스트 ===");
  console.log("전체 챌린지 개수:", challenges.length);
  console.log("전체 챌린지 목록:", challenges);
}

async function main() {
  console.log("=== PrChallengeRepository 테스트 시작 ===");

  // CREATE 테스트
  await testCreate();

  console.log("\n");

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