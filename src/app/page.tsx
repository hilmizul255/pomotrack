"use client";

import TimerDisplay from "./components/TimerDisplay";
import ModeSwitcher from "./components/ModeSwitcher";
import SessionCount from "./components/SessionCount";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {/* mode switcher */}
      <ModeSwitcher />
      {/* timer */}
      <TimerDisplay />
      {/* session count */}
      <SessionCount />
    </div>
  );
}
