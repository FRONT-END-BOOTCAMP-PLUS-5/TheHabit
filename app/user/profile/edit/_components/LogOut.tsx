'use client';

import { signOut } from 'next-auth/react';

type LogOutVariant = 'primary' | 'outline';

type LogOutProps = {
  className?: string;
  variant?: LogOutVariant;
  'data-testid'?: string;
};

const variantClassName: Record<LogOutVariant, string> = {
  primary: 'bg-[#93d50b] text-white hover:bg-[#81ac2c] shadow-md hover:shadow-lg',
  outline:
    'border border-gray-200 bg-white text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200',
};

const baseClassName =
  'w-full h-10 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#93d50b]/30 active:scale-[0.98]';

const LogOut = ({
  className,
  variant = 'outline',
  'data-testid': dataTestId = 'logout-button',
}: LogOutProps) => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login', redirect: true });
  };
  return (
    <button
      type='button'
      onClick={handleLogout}
      className={className ?? `${baseClassName} ${variantClassName[variant]}`}
      data-testid={dataTestId}
    >
      로그아웃
    </button>
  );
};

export default LogOut;
