'use client';

import React, { forwardRef } from 'react';

interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | React.ReactNode;
  labelHtmlFor?: string;
  labelStyle?: string;
}

const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  ({ label, labelHtmlFor, className, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-2'>
        {label && (
          <label className='w-full p-1 text-secondary' htmlFor={labelHtmlFor}>
            {label}
          </label>
        )}
        <textarea
          {...props}
          ref={ref}
          className={`w-full px-3 py-2 text-secondary placeholder:text-secondary-grey border-2 border-primary-grey rounded-md focus:border-primary focus:outline-none resize-none ${
            className || ''
          }`}
        />
      </div>
    );
  }
);

CustomTextarea.displayName = 'CustomTextarea';

export default CustomTextarea;