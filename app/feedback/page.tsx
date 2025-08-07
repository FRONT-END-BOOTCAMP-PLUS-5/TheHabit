"use client";

import { axiosInstance } from "@/public/utils/axiosInstance";

const FeedbackPage = () => {
  const handleClick = async () => {
    try {
      const instance = await axiosInstance.post("/api/feedback", {
        gptResponseContent: "승민님 바보야",
        challengeId: 24,
      });
      console.log(instance.data);
    } catch (error) {
      console.log(error);
    }
  };

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
