"use client";

import TimerDisplay from "./components/TimerDisplay";
import ModeSwitcher from "./components/ModeSwitcher";
import SessionCount from "./components/SessionCount";
import SettingsModal from "./components/Setting";
import Snackbar from "./components/Snackbar";
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
      {/* settings */}
      <SettingsModal />
      <Snackbar
        message={snackbarMessage}
        show={snackbarShow}
        onClose={handleSnackbarClose}
      />
    </div>
  );
}
