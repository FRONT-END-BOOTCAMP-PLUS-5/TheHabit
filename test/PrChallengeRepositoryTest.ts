import { PrChallengeRepository } from "@/backend/challenges/infrastructures/repositories/PrChallengeRepository";
import prisma from "@/public/utils/prismaClient";

async function main() {
  const challengeRepository = new PrChallengeRepository();
  const challenges = await challengeRepository.findAll();
  console.log(challenges);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
  });