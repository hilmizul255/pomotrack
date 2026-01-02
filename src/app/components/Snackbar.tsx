"use client";

import { useEffect } from "react";

type SnackbarProps = {
  message: string;
  show: boolean;
  onClose: () => void;
};

export default function Snackbar({ message, show, onClose }: SnackbarProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4
      rounded-lg bg-green-900 px-4 py-3 text-sm text-white shadow-lg
      transition-all duration-300
      ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 rounded-full p-1 hover:bg-green-800 transition-colors"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
