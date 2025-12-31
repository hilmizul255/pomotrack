"use client";

import { useTimer } from "../../providers/TimerProvider";

export default function SessionCount() {
    const { sessionCount } = useTimer();
    return (
        <div>
            <p>Session Count: {sessionCount}</p>
        </div>
    );
}