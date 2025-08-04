"use client"
import React from 'react';
import { Input } from 'antd';

interface CustomInputProps {
  placeholder?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder }) => {
  return <Input placeholder={placeholder || " "} />;
};

export default CustomInput;

// app에서 불러오기 
// 상단에 import Input from "./_components/Input/Input";
//  <Input placeholder="text 입력"/>  