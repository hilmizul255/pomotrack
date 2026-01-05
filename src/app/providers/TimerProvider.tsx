"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

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
  setSessionCount: (count: number) => void;
  /* Snackbar */
  snackbarMessage: string;
  snackbarShow: boolean;
  setSnackbarMessage: (message: string) => void;
  setSnackbarShow: (show: boolean) => void;
  /* Local state for draft values */
  localPomo: number;
  localShort: number;
  localLong: number;
  localSessionTarget: number;
  setLocalPomo: (length: number) => void;
  setLocalShort: (length: number) => void;
  setLocalLong: (length: number) => void;
  setLocalSessionTarget: (target: number) => void;
  localSessionWorkStartTime: string;
  setLocalSessionWorkStartTime: (time: string) => void;
  sessionWorkStartTime: string;
  setSessionWorkStartTime: (time: string) => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timerMode, setTimerMode] = useState("pomo");
  const [pomoLength, setPomoLength] = useState(25);
  const [shortLength, setShortLength] = useState(5);
  const [longLength, setLongLength] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState(pomoLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionTarget, setSessionTarget] = useState(4);
  const [sessionWorkStartTime, setSessionWorkStartTime] = useState("00:00");
  /* Snackbar */
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarShow, setSnackbarShow] = useState(false);
  // Local state for draft values
  const [localPomo, setLocalPomo] = useState(pomoLength);
  const [localShort, setLocalShort] = useState(shortLength);
  const [localLong, setLocalLong] = useState(longLength);
  const [localSessionTarget, setLocalSessionTarget] = useState(sessionTarget);
  const [localSessionWorkStartTime, setLocalSessionWorkStartTime] =
    useState(sessionWorkStartTime);

  const { data: session, status } = useSession();

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      if (status === "authenticated") {
        console.log("Loading settings from Database");
        try {
          const res = await fetch("/api/user/settings");
          if (res.ok) {
            const data = await res.json();
            setPomoLength(data.pomo_length);
            setShortLength(data.short_length);
            setLongLength(data.long_length);
            setSessionTarget(data.session_target);
            setSessionWorkStartTime(data.work_day_start);
            setTimerMode(data.timer_mode);
            return;
          }
        } catch (err) {
          console.error("Failed to load settings from DB", err);
        }
      }

      // Fallback to localStorage
      console.log("Loading settings from localStorage");
      const savedPomo = localStorage.getItem("pomoLength");
      const savedShort = localStorage.getItem("shortLength");
      const savedLong = localStorage.getItem("longLength");
      const savedTarget = localStorage.getItem("sessionTarget");
      const savedSessionWorkStartTime = localStorage.getItem(
        "sessionWorkStartTime"
      );

      if (savedPomo) setPomoLength(Number(savedPomo));
      if (savedShort) setShortLength(Number(savedShort));
      if (savedLong) setLongLength(Number(savedLong));
      if (savedTarget) setSessionTarget(Number(savedTarget));
      if (savedSessionWorkStartTime)
        setSessionWorkStartTime(savedSessionWorkStartTime);
    };

    loadSettings();
  }, [status]);

  // Save settings
  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      console.log("Saving settings to Database");
      fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pomo_length: pomoLength,
          short_length: shortLength,
          long_length: longLength,
          session_target: sessionTarget,
          work_day_start: sessionWorkStartTime,
          timer_mode: timerMode,
        }),
      }).catch((err) => console.error("Failed to save settings to DB", err));
    } else {
      console.log("Saving settings to localStorage");
      localStorage.setItem("pomoLength", pomoLength.toString());
      localStorage.setItem("shortLength", shortLength.toString());
      localStorage.setItem("longLength", longLength.toString());
      localStorage.setItem("sessionTarget", sessionTarget.toString());
      localStorage.setItem("sessionWorkStartTime", sessionWorkStartTime);
    }
  }, [
    pomoLength,
    shortLength,
    longLength,
    sessionTarget,
    sessionWorkStartTime,
    timerMode,
    status,
  ]);

  const playAudio = (src: string, times: number) => {
    const audio = new Audio(src);
    let count = 0;
    audio.addEventListener("ended", () => {
      count++;
      if (count < times) {
        audio.currentTime = 0;
        audio.play();
      }
    });
    audio.play();
  };

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
          setSnackbarMessage(
            "Congratulations! You have reached your session target!"
          );
          setSnackbarShow(true);
          playAudio("/sounds/congrats.mp3", 3);
          return;
        } else {
          nextMode = "short";
          nextSeconds = shortLength * 60;
          playAudio("/sounds/rest.mp3", 3);
        }
      } else if (timerMode === "short") {
        playAudio("/sounds/start.mp3", 3);
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
        setSessionCount,
        setPomoLength,
        setShortLength,
        setLongLength,
        sessionTarget,
        setSessionTarget,
        snackbarMessage,
        snackbarShow,
        setSnackbarMessage,
        setSnackbarShow,
        localPomo,
        localShort,
        localLong,
        localSessionTarget,
        setLocalPomo,
        setLocalShort,
        setLocalLong,
        setLocalSessionTarget,
        localSessionWorkStartTime,
        setLocalSessionWorkStartTime,
        sessionWorkStartTime,
        setSessionWorkStartTime,
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
