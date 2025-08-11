"use client";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="w-full flex justify-center items-center py-4">
      <Link href="/">
        <h1 className={"text-3xl font-black text-primary"}>The:Habit</h1>
      </Link>
    </header>
  );
};

export default Header;
