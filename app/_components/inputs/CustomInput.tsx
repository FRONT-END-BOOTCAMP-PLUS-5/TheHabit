'use client';

import React, { forwardRef } from 'react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelHtmlFor?: string;
  labelStyle?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, labelHtmlFor, labelStyle, className, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-2'>
        {label && (
          <label className='w-full p-1 text-secondary' htmlFor={labelHtmlFor}>
            {label}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          className={`w-full px-3 py-2 text-secondary placeholder:text-secondary-grey border-2 border-primary-grey rounded-md focus:border-primary focus:outline-none ${
            className || ''
          }`}
        />
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;
