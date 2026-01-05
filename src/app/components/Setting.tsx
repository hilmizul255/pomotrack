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
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16.165 7.861l-1.325-0.221c-0.153-0.657-0.413-1.272-0.762-1.826l0.738-1.033c0.281-0.394 0.237-0.934-0.105-1.276l-0.214-0.214c-0.342-0.342-0.882-0.387-1.276-0.105l-1.033 0.738c-0.555-0.349-1.169-0.609-1.826-0.762l-0.221-1.325c-0.080-0.482-0.498-0.836-0.986-0.836h-0.306c-0.489 0-0.906 0.353-0.986 0.836l-0.221 1.325c-0.657 0.153-1.271 0.413-1.826 0.762l-1.033-0.738c-0.394-0.281-0.934-0.237-1.276 0.105l-0.214 0.214c-0.342 0.343-0.387 0.882-0.105 1.276l0.738 1.033c-0.349 0.555-0.609 1.169-0.762 1.826l-1.325 0.221c-0.482 0.081-0.836 0.498-0.836 0.987v0.306c0 0.489 0.353 0.906 0.835 0.986l1.325 0.221c0.153 0.657 0.413 1.272 0.762 1.826l-0.738 1.033c-0.281 0.394-0.237 0.934 0.105 1.276l0.214 0.214c0.342 0.342 0.882 0.387 1.276 0.105l1.033-0.738c0.555 0.349 1.169 0.609 1.826 0.762l0.221 1.325c0.080 0.482 0.498 0.836 0.986 0.836h0.306c0.489 0 0.906-0.353 0.986-0.836l0.221-1.325c0.657-0.153 1.271-0.413 1.826-0.762l1.033 0.738c0.394 0.281 0.934 0.237 1.276-0.105l0.214-0.214c0.342-0.343 0.387-0.882 0.105-1.276l-0.738-1.033c0.349-0.555 0.609-1.169 0.762-1.826l1.325-0.221c0.482-0.080 0.835-0.498 0.835-0.986v-0.306c0-0.489-0.353-0.906-0.835-0.987zM9 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"></path>
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
