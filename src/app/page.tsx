"use client";

import Header from "./components/Header";
import Snackbar from "./components/Snackbar";
import ModeSwitcher from "./components/ModeSwitcher";
import TimerDisplay from "./components/TimerDisplay";
import SessionCount from "./components/SessionCount";
import { useTimer } from "./providers/TimerProvider";

export default function Home() {
  const {
    snackbarMessage,
    snackbarShow,
    setSnackbarShow,
    setPomoLength,
    pomoLength,
    setSecondsLeft,
    setTimerMode,
    setIsActive,
    setSessionCount,
  } = useTimer();

  const handleSnackbarClose = () => {
    setSnackbarShow(false);
    // reset to latest pomoLength
    setTimerMode("pomo");
    setSecondsLeft(pomoLength * 60);
    setIsActive(false);
    setSessionCount(0);
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4">
      <Header />

      <div className="w-full max-w-[480px] mt-8 bg-white/10 rounded-lg p-6 flex flex-col items-center">
        {/* mode switcher */}
        <ModeSwitcher />
        {/* timer */}
        <TimerDisplay />
      </div>
      <div className="mt-8">
        <SessionCount />
      </div>
      <Snackbar
        message={snackbarMessage}
        show={snackbarShow}
        onClose={handleSnackbarClose}
      />
    </main>
  );
}
