"use client";

import { CheckBoxItem } from "@/public/consts/checkBoxItem";
import { Checkbox } from "antd";
import React from "react";

export const CheckBox = () => {
  return (
    <div className="flex flex-col gap-4">
      {CheckBoxItem.map((item) => (
        <Checkbox key={item.id} required={item.required} className="flex">
          {item.required && (
            <span className="text-[#34A853] text-sm text-bold font-bold">
              [필수]
            </span>
          )}
          {item.label}
        </Checkbox>
      ))}
    </div>
  );
};
