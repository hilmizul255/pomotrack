"use client";

import { useEffect } from "react";
import { useTimer } from "../providers/TimerProvider";

export default function TitleUpdater() {
  const { secondsLeft, timerMode, isActive } = useTimer();

  useEffect(() => {
    let colorVar = "--background-pomo";
    if (timerMode === "short") colorVar = "--background-short";
    if (timerMode === "long") colorVar = "--background-long";

    document.documentElement.style.setProperty(
      "--background",
      `var(${colorVar})`
    );
  }, [timerMode]);

  useEffect(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    let modeLabel = "Focusing!";
    if (timerMode === "short" || timerMode === "long") modeLabel = "Resting!";

    if (!isActive) {
      document.title = "Pomotrack";
    } else {
      document.title = `${timeStr} - ${modeLabel}`;
    }
  }, [secondsLeft, timerMode, isActive]);

  return null;
}
