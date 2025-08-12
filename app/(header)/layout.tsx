import { TabNavigation } from "@/app/_components/tab-navigations/TabNavigation";
import Header from "@/app/_components/layouts/Header";
import React from "react";

export const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <Header />
      {children}
    </div>
  );
};
