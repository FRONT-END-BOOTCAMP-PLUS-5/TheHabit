'use client'
import { Button as AntdButton } from "antd";

interface IButton{
  children: React.ReactNode
  type: "default" | "primary" | "link" | "text" | "dashed"
  color: "default" | "primary" | "danger" | "blue" | "purple" | "cyan" | "green" | "magenta" | "pink" | "red" | "orange" | "yellow" | "volcano" | "geekblue" | "lime" | "gold"
  onClick: () => void
}

export default function Button({ children, type, color, onClick }:IButton) {
  return <AntdButton type={type} color={color} onClick={onClick}>{children}</AntdButton>
}
