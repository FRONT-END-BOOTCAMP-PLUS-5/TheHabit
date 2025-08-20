'use client';
import { signOut } from 'next-auth/react';
import React from 'react';

const LogOut = () => {
  return (
    <button
      onClick={async () => {
        await signOut({ callbackUrl: '/login' });
      }}
      className='w-[100px] h-8 px-6 bg-[#93d50b] hover:bg-green-600 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#93d50b] focus:ring-opacity-50'
    >
      로그아웃
    </button>
  );
};

export default LogOut;
