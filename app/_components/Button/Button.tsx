"use client";
import { Button as AntdButton } from "antd";

//차후 tailwind css 사용할때 상수화

interface IButton {
  children: React.ReactNode;
  type?: "default" | "primary" | "link" | "text" | "dashed";
  color?:
    | "default"
    | "primary"
    | "danger"
    | "blue"
    | "purple"
    | "cyan"
    | "green"
    | "magenta"
    | "pink"
    | "red"
    | "orange"
    | "yellow"
    | "volcano"
    | "geekblue"
    | "lime"
    | "gold";
  onClick?: () => void;
  className?: string;
  htmlType?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
}

export default function Button({
  children,
  type,
  color,
  onClick,
  className,
  htmlType,
  style,
}: IButton) {
  return (
    <AntdButton
      type={type}
      color={color}
      onClick={onClick}
      className={className}
      htmlType={htmlType}
      style={style}
    >
      {children}
    </AntdButton>
  );
}
