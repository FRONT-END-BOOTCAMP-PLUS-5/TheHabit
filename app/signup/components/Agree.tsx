// app/signup/components/Agree.tsx
import React from "react";
import { Checkbox } from "antd";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";

interface AgreeProps<T extends FieldValues> {
  label: string;
  name: FieldPath<T>;
  control: Control<T>;
  required?: boolean;
  onChange?: (checked: boolean) => void;
}

const Agree = <T extends FieldValues>({ 
  label, 
  name, 
  control, 
  required = false,
  onChange
}: AgreeProps<T>) => {
  const renderLabel = () => {
    const bracketRegex = /\[([^\]]+)\]/g; // 대괄호 안의 텍스트를 찾는 정규식
    const parts = [];
    let lastIndex = 0;
    let match;

    // [필수] 같은 항목 대괄호 안 텍스트 인식 처리
    while ((match = bracketRegex.exec(label)) !== null) {
      if (match.index > lastIndex) {
        parts.push(label.slice(lastIndex, match.index));
      }

      parts.push(
        <span key={match.index} style={{ color: "red" }}>
          {match[0]}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // 마지막 대괄호 이후 텍스트 추가
    if (lastIndex < label.length) {
      parts.push(label.slice(lastIndex));
    }

    return parts.length > 0 ? parts : label;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ 
        required: required ? "이 항목은 필수입니다." : false 
      }}
      render={({ field, fieldState }) => (
        <div>
          <Checkbox
            checked={field.value}
            onChange={(e) => {
              field.onChange(e.target.checked);
              onChange?.(e.target.checked);
            }}
          >
            {renderLabel()}
          </Checkbox>
          {fieldState.error && (
            <div className="text-red-600 text-xs mt-1">
              {fieldState.error.message}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default Agree;
