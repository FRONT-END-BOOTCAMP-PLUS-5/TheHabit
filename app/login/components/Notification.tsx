// app/auth/components/Notification.tsx
"use client";
import React from "react";

interface NotificationProps {
  type: "success" | "error";
  message: string;
}

const icons = {
  success: (
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const Notification: React.FC<NotificationProps> = ({ type, message }) => {
  const baseClass = "mb-4 p-4 rounded-lg flex items-center border";
  const typeClass =
    type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";

  return (
    <div className={`${baseClass} ${typeClass}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

export default Notification;
