import { TabNavigation } from "@/app/_components/tab-navigations/TabNavigation";
import React from "react";

export const TabNavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      {children}
      <TabNavigation />
    </div>
  );
};
