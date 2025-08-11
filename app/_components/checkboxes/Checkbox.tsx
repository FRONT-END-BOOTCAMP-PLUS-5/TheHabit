"use client";

import { CheckBoxItem } from "@/public/consts/checkBoxItem";
import { Checkbox as AntdCheckbox } from "antd";
import React from "react";

// 회원가입용 체크박스 리스트 컴포넌트
export const CheckBoxList = () => {
  return (
    <div className="flex flex-col gap-4">
      {CheckBoxItem.map((item) => (
        <AntdCheckbox key={item.id} required={item.required} className="flex">
          {item.required && (
            <span className="text-[#34A853] text-sm text-bold font-bold">
              [필수]
            </span>
          )}
          {item.label}
        </AntdCheckbox>
      ))}
    </div>
  );
};

// 일반적인 단일 체크박스 컴포넌트
interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  className,
  children,
  disabled = false,
  ...rest
}) => {
  const handleChange = (e: any) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <AntdCheckbox
      checked={checked}
      onChange={handleChange}
      className={className}
      disabled={disabled}
      {...rest}
    >
      {children}
    </AntdCheckbox>
  );
};