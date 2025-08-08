"use client";
import React from "react";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

interface CustomInputProps {
  placeholder?: string;
  label?: string;
  labelHtmlFor?: string;
  maxLength?: number;
  className?: string;
  style?: React.CSSProperties;
  type?: "text" | "password" | "email" | "number";
  labelStyle?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  label,
  labelHtmlFor,
  maxLength,
  className,
  style,
  labelStyle,
  type = "text",
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={labelStyle} htmlFor={labelHtmlFor}>
          {label}
        </label>
      )}
      {type === "password" ? (
        <Input.Password
          placeholder={placeholder}
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
          placeholder={placeholder}
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
