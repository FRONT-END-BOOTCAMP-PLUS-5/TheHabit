"use client";
import React from "react";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface CustomInputProps {
  placeholder?: string;
  label?: string;
  labelHtmlFor?: string;
  maxLength?: number;
  className?: string;
  style?: React.CSSProperties;
  type?: 'text' | 'password' | 'email' | 'number';
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  placeholder, 
  label, 
  labelHtmlFor,
  maxLength,
  className,
  style,
  type = 'text',
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
      {type === 'password' ? (
        <Input.Password
          placeholder={placeholder || " "}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          id={labelHtmlFor}
          className={className}
          style={style}
          {...rest}
        />
      ) : (
        <Input 
          type={type}
          placeholder={placeholder || " "} 
          maxLength={maxLength}
          id={labelHtmlFor}
          className={className}
          style={style}
          {...rest}
        />
      )}
    </div>
  );
};

export default CustomInput;

// app에서 불러오기 
// 상단에 import Input from "./_components/Input/Input";
// 일반 텍스트: <Input label="닉네임" labelHtmlFor="nickName" placeholder="ex) 홍길동" {...register("nickName")} />
// 비밀번호: <Input type="password" label="비밀번호" labelHtmlFor="password" placeholder="비밀번호를 입력하세요" {...register("password")} />  
