import { PrFeedBackRepository } from "@/backend/feedbacks/infrastructures/repositories/PrFeedBackRepository";
import { FeedBackEntity } from "@/backend/feedbacks/domains/entities/FeedBackEntity";

export async function testAddFeedBack() {
  const feedBackRepository = new PrFeedBackRepository();

  // 테스트용 챌린지 데이터 생성
  const testFeedBack = new FeedBackEntity("test", 16); // 존재하는 challengeId로 테스트

  try {
    console.log("=== CREATE 테스트 시작 ===");
    console.log("생성할 피드백:", testFeedBack);

    // 피드백 생성
    const createdFeedBack = await feedBackRepository.AddFeedBack(testFeedBack);
    console.log("생성된 피드백:", createdFeedBack);
  } catch (error) {
    console.error("CREATE 테스트 중 오류 발생:", error);
  }
}

// 테스트 실행
async function main() {
  console.log("=== PrFeedBackRepository 테스트 시작 ===");
  await testAddFeedBack();
}

main();
