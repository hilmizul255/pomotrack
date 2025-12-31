"use client";

import { useTimer } from "../../providers/TimerProvider";

export default function Timer() {
  const { secondsLeft, isActive, setIsActive } = useTimer();

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  console.log(isActive);

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "4rem", margin: "1rem 0" }}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </p>
      <button
        onClick={() => setIsActive(!isActive)}
        style={{
          padding: "0.5rem 2rem",
          fontSize: "1.2rem",
          cursor: "pointer",
        }}
      >
        {isActive ? "PAUSE" : "START"}
      </button>
    </div>
  );
}
