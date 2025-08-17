'use client';


interface IButton{
  children: React.ReactNode;
  onClick: () => void;
  className?: string
}

export const Button = ({ children, onClick, className }: IButton) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}