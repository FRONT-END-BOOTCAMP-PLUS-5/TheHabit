"use client";
import React from "react";
import { Input } from "antd";

interface CustomInputProps {
  placeholder?: string;
  label?: string;
  labelHtmlFor?: string;
  maxLength?: number;
  className?: string;
  style?: React.CSSProperties;
}


const CustomInput: React.FC<CustomInputProps> = ({ 
  placeholder, 
  label, 
  labelHtmlFor,
  maxLength,
  className,
  style,
  ...rest 
}) => {
  return (
    <div>
      {label && (
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={labelHtmlFor}
        >
          {label}
        </label>
      )}
      <Input 
        placeholder={placeholder || " "} 
        maxLength={maxLength}
        id={labelHtmlFor}
        className={className}
        style={style}
        {...rest}
      />
    </div>
  );
};

export default CustomInput;

// app에서 불러오기 
// 상단에 import Input from "./_components/Input/Input";
//  <Input label="닉네임" labelHtmlFor="nickName" placeholder="ex) 홍길동" {...register("nickName")} />  
