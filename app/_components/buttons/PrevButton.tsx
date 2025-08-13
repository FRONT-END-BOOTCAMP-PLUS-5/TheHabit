"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export const PrevButton = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.back()}
      src="/icons/back.svg"
      alt="뒤로가기"
      width={20}
      height={20}
      className={className}
    />
  );
};
