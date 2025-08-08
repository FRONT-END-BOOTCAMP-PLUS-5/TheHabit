"use client";

import { axiosInstance } from "@/public/utils/axiosInstance";

const FeedbackPage = () => {
  const handleClick = async () => {};

  return (
    <div className="w-full h-full">
      <h1>피드백</h1>
      <button onClick={handleClick} className="cursor-pointer">
        피드백 추가
      </button>
    </div>
  );
};

export default FeedbackPage;
