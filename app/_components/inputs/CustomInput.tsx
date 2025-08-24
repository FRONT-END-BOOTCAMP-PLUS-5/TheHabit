'use client';

import React, { forwardRef, useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19'

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelHtmlFor?: string;
  labelStyle?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, labelHtmlFor, labelStyle, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className='flex flex-col gap-2'>
        {label && (
          <label className='w-full p-1 text-secondary' htmlFor={labelHtmlFor}>
            {label}
          </label>
        )}
        <div className='relative'>
          <input
            {...props}
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            className={`w-full px-3 py-2 text-secondary placeholder:text-secondary-grey border-2 border-primary-grey rounded-md focus:border-primary focus:outline-none ${
              isPassword ? 'pr-10' : ''
            } ${className || ''}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-grey hover:text-secondary transition-colors"
            >
              {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;
