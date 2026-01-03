"use client";

import { useTimer } from "../providers/TimerProvider";
import SettingsModal from "./Setting";

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full max-w-[620px] py-4 border-b border-black/10 mb-8">
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
          className="bg-white text-[#ba4949] rounded-full p-0.5"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Pomotrack</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-sm transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span className="hidden sm:inline">Report</span>
        </button>

        <SettingsModal />

        <div className="w-8 h-8 rounded-md bg-white/20 overflow-hidden ml-1 border border-white/30 cursor-pointer">
          <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-[10px]">
            👤
          </div>
        </div>
      </div>
    </header>
  );
}
