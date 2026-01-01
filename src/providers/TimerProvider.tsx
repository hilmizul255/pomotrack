"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface TimerContextType {
  timerMode: string;
  setTimerMode: (mode: string) => void;
  secondsLeft: number;
  setSecondsLeft: (seconds: number | ((s: number) => number)) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  pomoLength: number;
  shortLength: number;
  longLength: number;
  sessionCount: number;
  sessionTarget: number;
  setPomoLength: (length: number) => void;
  setShortLength: (length: number) => void;
  setLongLength: (length: number) => void;
  setSessionTarget: (target: number) => void;
  /* Snackbar */
  snackbarMessage: string;
  snackbarShow: boolean;
  setSnackbarMessage: (message: string) => void;
  setSnackbarShow: (show: boolean) => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timerMode, setTimerMode] = useState("pomo");
  const [pomoLength, setPomoLength] = useState(0.025);
  const [shortLength, setShortLength] = useState(5);
  const [longLength, setLongLength] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState(pomoLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionTarget, setSessionTarget] = useState(1);
  /* Snackbar */
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarShow, setSnackbarShow] = useState(false);

  /* Sync durations when mode changes instantly */
  useEffect(() => {
    if (isActive === true) return; // don't reset while running
    let currentLength = pomoLength;
    if (timerMode === "short") currentLength = shortLength;
    if (timerMode === "long") currentLength = longLength;

    setSecondsLeft(currentLength * 60);
  }, [timerMode, pomoLength, shortLength, longLength]);

  /* Handle timer behavior */
  useEffect(() => {
    //1. do nothing if timer is not active
    if (isActive === false) return;

    //2. stop the timer and switch modes if time reaches zero
    if (secondsLeft <= 0) {
      let nextMode = "pomo";
      let nextSeconds = pomoLength * 60;

      if (timerMode === "pomo") {
        const newCount = sessionCount + 1;
        setSessionCount(newCount);

        if (newCount >= sessionTarget) {
          setIsActive(false);
          return;
        } else {
          nextMode = "short";
          nextSeconds = shortLength * 60;
        }
      }

      setTimerMode(nextMode);
      setSecondsLeft(nextSeconds);
      setIsActive(true); // then restart automatically
      return;
    }

    //3. start interval to decrement seconds every second until it reaches 0
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isActive,
    secondsLeft,
    timerMode,
    pomoLength,
    shortLength,
    longLength,
    sessionCount,
    sessionTarget,
  ]);

  return (
    <TimerContext.Provider
      value={{
        timerMode,
        setTimerMode,
        secondsLeft,
        setSecondsLeft,
        isActive,
        setIsActive,
        pomoLength,
        shortLength,
        longLength,
        sessionCount,
        setPomoLength,
        setShortLength,
        setLongLength,
        sessionTarget,
        setSessionTarget,
        snackbarMessage,
        snackbarShow,
        setSnackbarMessage,
        setSnackbarShow,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
