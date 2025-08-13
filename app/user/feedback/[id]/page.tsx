import React from "react";
import FeedBackDetail from "@/app/user/feedback/_components/FeedBackDetail";

const FeedbackPage = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = await params;
  console.log("id", id);

  return <FeedBackDetail />;
};

export default FeedbackPage;
