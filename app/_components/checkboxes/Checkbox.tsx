'use client';

import { CheckBoxItem } from '@/public/consts/checkBoxItem';
import { Checkbox as AntdCheckbox, CheckboxChangeEvent } from 'antd';
import React, { useState } from 'react';

// 회원가입용 체크박스 리스트 컴포넌트 Props
interface CheckBoxListProps {
  onChange?: (checkedItems: { [key: number]: boolean }) => void;
}

export const CheckBoxList: React.FC<CheckBoxListProps> = ({ onChange }) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});

  const handleItemChange = (itemId: number, checked: boolean) => {
    const newCheckedItems = { ...checkedItems, [itemId]: checked };
    setCheckedItems(newCheckedItems);

    if (onChange) {
      onChange(newCheckedItems);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      {CheckBoxItem.map(item => (
        <AntdCheckbox
          key={item.id}
          required={item.required}
          className='flex'
          checked={checkedItems[item.id] || false}
          onChange={(e: CheckboxChangeEvent) => handleItemChange(item.id, e.target.checked)}
        >
          {item.required && (
            <span className='text-[#34A853] text-sm text-bold font-bold'>[필수]</span>
          )}
          {item.label}
        </AntdCheckbox>
      ))}
    </div>
  );
};

// 일반적인 단일 체크박스 컴포넌트
interface CheckboxProps {
  checked?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  className,
  children,
  disabled = false,
  ...rest
}) => {
  const handleChange = (e: CheckboxChangeEvent) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <AntdCheckbox
      checked={checked}
      onChange={handleChange}
      className={className}
      disabled={disabled}
      {...rest}
    >
      {children}
    </AntdCheckbox>
  );
};
