"use client";

import { useTimer } from "../providers/TimerProvider";

export default function SessionCount() {
  const { sessionCount, sessionTarget } = useTimer();

  return (
    <div>
      <p>
        Session Count: {sessionCount}/{sessionTarget}
      </p>
    </div>
  );
}
