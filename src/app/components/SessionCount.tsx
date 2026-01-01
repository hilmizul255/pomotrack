"use client";

import { useTimer } from "../../providers/TimerProvider";
import Snackbar from "./Snackbar";
import { useEffect } from "react";

export default function SessionCount() {
  const {
    sessionCount,
    sessionTarget,
    snackbarMessage,
    snackbarShow,
    setSnackbarMessage,
    setSnackbarShow,
  } = useTimer();

  useEffect(() => {
    if (sessionCount === sessionTarget) {
      setSnackbarMessage("Congratulations! You have reached your session target!");
      setSnackbarShow(true);
    }
  }, [sessionCount, sessionTarget]);

  return (
    <div>
      <p>
        Session Count: {sessionCount}/{sessionTarget}
      </p>
      <Snackbar
        message={snackbarMessage}
        show={snackbarShow}
        onClose={() => setSnackbarShow(false)}
      />
    </div>
  );
}
