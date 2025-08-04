import React from "react";
import { TabNavigation } from "@/app/_components/TabNavigation/TabNavigation";

const FeedbackLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <TabNavigation />
      {children}
    </div>
  );
};

export default FeedbackLayout;
