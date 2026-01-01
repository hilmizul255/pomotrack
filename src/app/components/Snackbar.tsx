"use client";

import { useEffect } from "react";

type SnackbarProps = {
  message: string;
  show: boolean;
  onClose: () => void;
};

export default function Snackbar({ message, show, onClose }: SnackbarProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2
      rounded-lg bg-green-900 px-4 py-2 text-sm text-white shadow-lg
      transition-all duration-300
      ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {message}
    </div>
  );
}
