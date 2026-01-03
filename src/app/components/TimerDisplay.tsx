"use client";

import { useTimer } from "../providers/TimerProvider";

export default function Timer() {
  const { secondsLeft, isActive, setIsActive } = useTimer();

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="flex flex-col items-center">
      <div className="text-[120px] font-bold leading-none mb-8 tracking-tight">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>
      <button
        onClick={() => setIsActive(!isActive)}
        className={`bg-white text-[#ba4949] font-bold text-2xl px-12 py-4 rounded-md shadow-[0_6px_0_rgb(235,235,235)] transition-all active:translate-y-1 active:shadow-none mb-4 uppercase w-48`}
      >
        {isActive ? "PAUSE" : "START"}
      </button>
    </div>
  );
}
