"use client";

import { useGetAllChallenges } from "@/libs/hooks/challenges-hooks/useGetAllChallenges";
import Link from "next/link";

export const FeedBackList = () => {
  const { data } = useGetAllChallenges();

  return (
    <div className="flex flex-col gap-2">
      {data?.map((challenge) => (
        <Link key={challenge.id} href={`/feedback/${challenge.id}`}>
          {challenge.name}
        </Link>
      ))}
    </div>
  );
};
