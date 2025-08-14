'use client';
import React, { RefObject } from 'react';
import { Input, InputRef } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface CustomInputProps {
  placeholder?: string;
  label?: string;
  labelHtmlFor?: string;
  maxLength?: number;
  className?: string;
  style?: React.CSSProperties;
  type?: 'text' | 'password' | 'email' | 'number';
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  labelStyle?: string;
  value?: string;
  name?: string;
  onBlur?: () => void;
  ref?: React.Ref<InputRef>;
}

export const CustomInput: React.FC<CustomInputProps> = React.forwardRef<InputRef, CustomInputProps>(
  (
    {
      placeholder,
      label,
      labelHtmlFor,
      maxLength,
      className,
      style,
      labelStyle,
      type = 'text',
      onChange,
      onKeyPress,
      value,
      name,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className='flex flex-col gap-2'>
        {label && (
          <label className={labelStyle} htmlFor={labelHtmlFor}>
            {label}
          </label>
        )}
        {type === 'password' ? (
          <Input.Password
            placeholder={placeholder}
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            id={labelHtmlFor}
            className={className}
            style={style}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            ref={ref}
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
            onChange={onChange}
            value={value}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            name={name}
            ref={ref}
            {...rest}
          />
        )}
      </div>
    );
  },
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;
