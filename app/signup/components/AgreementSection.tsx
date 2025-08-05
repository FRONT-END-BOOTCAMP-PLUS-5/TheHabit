"use client";

import { Control, FieldValues, FieldPath } from "react-hook-form";
import CheckBox from "./CheckBox";

interface AgreementSectionProps<T extends FieldValues> {
  control: Control<T>;
  handleCheckBoxAll: (checked: boolean) => void;
}

export default function AgreementSection<T extends FieldValues>({
  control,
  handleCheckBoxAll,
}: AgreementSectionProps<T>) {
  const CheckBoxItems = [
    {
      label: "전체 약관 동의",
      name: "CheckBoxAll" as FieldPath<T>,
      required: false,
      onChange: handleCheckBoxAll,
    },
    {
      label: "[필수] 개인 정보 처리에 동의",
      name: "CheckBoxRequired1" as FieldPath<T>,
      required: true,
    },
    {
      label: "[필수] 약관 처리에 동의 해주세요",
      name: "CheckBoxRequired2" as FieldPath<T>,
      required: true,
    },
    {
      label: "(선택) 개인 정보 보호를 위한 이용자 동의",
      name: "CheckBoxOptional" as FieldPath<T>,
      required: false,
    },
  ];

  return (
    <>
      {CheckBoxItems.map((item, index) => (
        <div key={String(item.name)}>
          <CheckBox
            label={item.label}
            name={item.name}
            control={control}
            required={item.required}
            onChange={item.onChange}
          />
          {index === 0 && <hr />}
        </div>
      ))}
    </>
  );
}
