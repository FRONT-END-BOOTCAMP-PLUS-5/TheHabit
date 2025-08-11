"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  message,
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6", 
    large: "w-8 h-8",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClasses[size]}`}
      />
      {message && (
        <p className="text-sm text-gray-500 mt-2 text-center">{message}</p>
      )}
    </div>
  );
};