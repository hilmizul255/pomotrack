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
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timerMode, setTimerMode] = useState("pomo");
  const [pomoLength, setPomoLength] = useState(25);
  const [shortLength, setShortLength] = useState(5);
  const [longLength, setLongLength] = useState(0.025);
  const [secondsLeft, setSecondsLeft] = useState(pomoLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    //do nothing if timer is not active
    if (isActive === false) return;

    // stop the timer and switch modes if time has run out
    if (secondsLeft <= 0) {
      let nextMode = "pomo";
      let nextSeconds = pomoLength * 60;

      if (timerMode === "pomo") {
        nextMode = "short";
        nextSeconds = shortLength * 60;
        setSessionCount((prev) => prev + 1);
      }

      setTimerMode(nextMode);
      setSecondsLeft(nextSeconds);
      setIsActive(true); // Restart automatically
      return;
    }

    // start interval to decrement seconds every second until it reaches 0
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, timerMode, pomoLength, shortLength, longLength]);

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
