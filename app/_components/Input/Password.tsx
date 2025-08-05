"use client"
import React from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';

interface CustomPasswordProps {
  placeholder?: string;
  label?: string;
  labelHtmlFor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CustomPassword: React.FC<CustomPasswordProps> = ({ 
  placeholder, 
  label, 
  labelHtmlFor,
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
    </div>
  );
};

export default CustomPassword;