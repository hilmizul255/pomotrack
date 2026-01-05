"use client";

import { useState, useEffect } from "react";
import { useTimer } from "../providers/TimerProvider";

export default function SettingsModal() {
  const [open, setOpen] = useState(false);
  const {
    pomoLength,
    shortLength,
    longLength,
    setPomoLength,
    setShortLength,
    setLongLength,
    sessionTarget,
    setSessionTarget,
    localPomo,
    localShort,
    localLong,
    localSessionTarget,
    setLocalPomo,
    setLocalShort,
    setLocalLong,
    setLocalSessionTarget,
    sessionWorkStartTime,
    setSessionWorkStartTime,
    localSessionWorkStartTime,
    setLocalSessionWorkStartTime,
  } = useTimer();

  // Sync local state when modal opens
  useEffect(() => {
    if (open) {
      setLocalPomo(pomoLength);
      setLocalShort(shortLength);
      setLocalLong(longLength);
      setLocalSessionTarget(sessionTarget);
      setLocalSessionWorkStartTime(sessionWorkStartTime);
    }
  }, [
    open,
    pomoLength,
    shortLength,
    longLength,
    sessionTarget,
    sessionWorkStartTime,
    setLocalPomo,
    setLocalShort,
    setLocalLong,
    setLocalSessionTarget,
    setLocalSessionWorkStartTime,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Number(value);
    switch (name) {
      case "pomo":
        setLocalPomo(numValue);
        break;
      case "short":
        setLocalShort(numValue);
        break;
      case "long":
        setLocalLong(numValue);
        break;
      case "sessionTarget":
        setLocalSessionTarget(numValue);
        break;
      case "sessionWorkStartTime":
        setLocalSessionWorkStartTime(value);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPomoLength(localPomo);
    setShortLength(localShort);
    setLongLength(localLong);
    setSessionTarget(localSessionTarget);
    setSessionWorkStartTime(localSessionWorkStartTime);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-sm transition-colors"
      >
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
          <path d="M12.22 2a1 1 0 0 0-.97.75l-.18.72a2 2 0 0 1-1.47 1.47l-.72.18a1 1 0 0 0-.75.97V7a1 1 0 0 0 .75.97l.72.18a2 2 0 0 1 1.47 1.47l.18.72a1 1 0 0 0 .97.75h.56a1 1 0 0 0 .97-.75l.18-.72a2 2 0 0 1 1.47-1.47l.72-.18a1 1 0 0 0 .75-.97V5.56a1 1 0 0 0-.75-.97l-.72-.18a2 2 0 0 1-1.47-1.47l-.18-.72a1 1 0 0 0-.97-.75h-.56Z"></path>
          <path d="M11 11.23a3 3 0 1 0 2.8 0"></path>
          <path d="M12 8a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3Z"></path>
        </svg>
        <span className="hidden sm:inline">Setting</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-black">Settings</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* 1. Pomodoro Timer */}
              <div>
                <label htmlFor="pomo" className="w-full text-black">
                  Pomodoro
                </label>
                <input
                  type="number"
                  name="pomo"
                  id="pomo"
                  className="text-black placeholder:text-gray-400 w-full border border-black px-2"
                  value={localPomo}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="short" className="w-full text-black">
                  Short Break
                </label>
                <input
                  type="number"
                  name="short"
                  id="short"
                  className="text-black placeholder:text-gray-400 w-full border border-black px-2"
                  value={localShort}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="long" className="w-full text-black">
                  Long Break
                </label>
                <input
                  type="number"
                  name="long"
                  id="long"
                  className="text-black placeholder:text-gray-400 w-full border border-black px-2"
                  value={localLong}
                  onChange={handleChange}
                />
              </div>

              {/* 2. Session Target */}
              <div>
                <label htmlFor="sessionTarget" className="w-full text-black">
                  Session Target
                </label>
                <input
                  type="number"
                  name="sessionTarget"
                  id="sessionTarget"
                  className="text-black placeholder:text-gray-400 w-full border border-black px-2"
                  value={localSessionTarget}
                  onChange={handleChange}
                />
              </div>

              {/*Session Work Start Time*/}
              <div>
                <label
                  htmlFor="sessionWorkStartTime"
                  className="w-full text-black"
                >
                  Session Work Start Time
                </label>
                <input
                  type="time"
                  name="sessionWorkStartTime"
                  id="sessionWorkStartTime"
                  className="text-black placeholder:text-gray-400 w-full border border-black px-2"
                  value={localSessionWorkStartTime}
                  onChange={handleChange}
                />
              </div>

              {/* 4. Save Button */}
              <div className="flex w-full justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded bg-gray-200 px-4 py-2 text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-black px-4 py-2 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
