"use client"
import React from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';

interface CustomPasswordProps {
  placeholder?: string;
}

const CustomPassword: React.FC<CustomPasswordProps> = ({ placeholder }) => {
  return (
    <Input.Password
      placeholder={placeholder || " "}
      iconRender={(visible) =>
        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
      }
    />
  );
};

export default CustomPassword;