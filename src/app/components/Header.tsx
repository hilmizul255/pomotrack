"use client";

import { useTimer } from "../providers/TimerProvider";
import SettingsModal from "./Setting";
import Profile from "./Profile";
import ReportModal from "./Report";

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full max-w-[620px] py-4 border-b border-black/10 mb-8">
      {/* logo */}
      <div className="flex items-center gap-1 font-bold text-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="bg-white text-accent rounded-full p-0.5"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Pomotrack</span>
      </div>

      {/* user menu */}
      <div className="flex items-center gap-2">
        <ReportModal />

        <SettingsModal />

        <Profile />
      </div>
    </header>
  );
}
