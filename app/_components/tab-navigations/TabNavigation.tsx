"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { tabItem } from "@/public/consts/tabItem";
import addIcon from "@/public/icons/tabButton.svg";

export const TabNavigation = () => {
  const [isHover, setIsHover] = useState<string>("");

  const isMouseHover = (name: string) => {
    setIsHover(name);
  };

  const isMouseOut = () => {
    setIsHover("");
  };

  return (
    <nav>
      <ul className=" w-11/12 h-22 flex justify-around shadow-2xl items-center absolute bottom-10 left-1/2 -translate-x-1/2 rounded-xl">
        {tabItem.map((item, i) => (
          <li key={i}>
            <Link
              href={item.href || ""}
              className="w-12 h-12 flex justify-center items-center"
            >
              <Image
                src={isHover === item.name ? item.isHover : item.icon}
                alt={item.name}
                className="w-7 h-7"
                onMouseLeave={isMouseOut}
                onMouseEnter={() => isMouseHover(item.name)}
              />
            </Link>
          </li>
        ))}
        <Image
          src={addIcon}
          alt="추가하기"
          className="w-18 h-18 absolute bottom-1/2 cursor-pointer hover:scale-110 transition-all duration-300 hover:opacity-90"
        />
      </ul>
    </nav>
  );
};
