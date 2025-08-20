import { signOut } from 'next-auth/react';
import React from 'react';

export default function LogOut() {
  return (
    <button
      onClick={async () => {
        await signOut({ callbackUrl: '/login' });
      }}
      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    >
      로그아웃
    </button>
  );
}
