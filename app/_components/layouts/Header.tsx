"use client";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="w-full flex justify-center items-center">
      <div className="w-full max-w-screen-xl flex justify-between items-center">
        <Link href="/">
          <h1 className={"text-xl font-bold text-primary"}>The:Habit</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
