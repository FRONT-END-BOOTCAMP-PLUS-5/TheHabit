import Header from "@/app/_components/layouts/Header";
import React from "react";

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <Header />
      {children}
    </div>
  );
};
export default HeaderLayout;
