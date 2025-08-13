"use client";

import { useState } from "react";
import { FeedBackStatistics } from "@/app/user/feedback/_components/FeedBackStatistics";
import FeedBackDetail from "@/app/user/feedback/_components/FeedBackDetail";

const FEEDBACK_CATEGORIES = [
  { id: 1, name: "통계" },
  { id: 2, name: "분석" },
] as const;

export const FeedBackList = () => {
  const [selectedCategoryName, setSelectedCategoryName] =
    useState<string>("통계");

  const handleModal = (name: string) => {
    setSelectedCategoryName(name);
  };

  return (
    <section className="flex flex-col mt-10 w-full">
      <nav className="flex flex-1 items-center justify-between w-full h-1/3">
        <div className="w-full flex justify-center">
          {FEEDBACK_CATEGORIES.map((linkItem) => {
            return (
              <div
                key={linkItem.id}
                className="w-1/2 flex items-center justify-center"
              >
                <div className="text-center w-1/3">
                  <button
                    className={`text-xl font-bold cursor-pointer  ${
                      selectedCategoryName === linkItem.name
                        ? "border-b-2 border-black"
                        : "border-b-2 border-transparent"
                    }`}
                    onClick={() => handleModal(linkItem.name)}
                  >
                    <p>{linkItem.name}</p>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
      {selectedCategoryName === "통계" ? (
        <FeedBackStatistics />
      ) : (
        <FeedBackDetail />
      )}
    </section>
  );
};
