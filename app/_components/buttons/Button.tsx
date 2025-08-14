"use client";
import '@ant-design/v5-patch-for-react-19';
<<<<<<< HEAD

=======
>>>>>>> 690e8c53bf2141217965b4787c2aa5bf2cd79274
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
  disabled?: boolean
<<<<<<< HEAD

=======
>>>>>>> 690e8c53bf2141217965b4787c2aa5bf2cd79274
}

export const Button = ({
  children,
  type,
  color,
  onClick,
  className,
  htmlType,
  style,
  disabled = false
}: IButton) => {
  return (
    <AntdButton
      type={type}
      color={color}
      onClick={onClick}
      className={className}
      htmlType={htmlType}
      style={style}
      disabled={disabled}
    >
      {children}
    </AntdButton>
  );
};
