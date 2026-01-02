"use client";

import { useTimer } from "../providers/TimerProvider";

export default function ModeSwitcher() {
  const { timerMode, setTimerMode, setIsActive } = useTimer();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.id;
    setTimerMode(newMode);
    setIsActive(false);
  };

  return (
    <form>
      <input
        type="radio"
        id="pomo"
        name="mode"
        value="pomo"
        checked={timerMode === "pomo"}
        onChange={handleModeChange}
      />
      <label htmlFor="pomo">pomodoro</label>

      <input
        type="radio"
        id="short"
        name="mode"
        value="short"
        checked={timerMode === "short"}
        onChange={handleModeChange}
      />
      <label htmlFor="short">break</label>

      <input
        type="radio"
        id="long"
        name="mode"
        value="long"
        checked={timerMode === "long"}
        onChange={handleModeChange}
      />
      <label htmlFor="long">long break</label>
    </form>
  );
}
