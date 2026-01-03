"use client";

import { useTimer } from "../providers/TimerProvider";

export default function ModeSwitcher() {
  const { timerMode, setTimerMode, setIsActive } = useTimer();

  const handleModeChange = (newMode: string) => {
    setTimerMode(newMode);
    setIsActive(false);
  };

  const modes = [
    { id: "pomo", label: "Pomodoro" },
    { id: "short", label: "Short Break" },
    { id: "long", label: "Long Break" },
  ];

  return (
    <div className="flex gap-2 p-1 mb-4">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => handleModeChange(mode.id)}
          className={`px-4 py-1 rounded-md text-sm font-semibold transition-all
            ${
              timerMode === mode.id
                ? "bg-black/15 shadow-inner"
                : "hover:bg-black/5"
            }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
