import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface StatsSummary {
  total_focus_minutes: number;
  total_sessions: number;
  current_streak: number;
}

interface PeriodStat {
  period: string;
  total_focus_minutes: number;
  session_count: number;
}

export default function ReportModal() {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [stats, setStats] = useState<PeriodStat[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (open && session?.user?.id) {
      const fetchStats = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `/api/session/stats?userId=${session.user.id}&period=${period}`
          );
          if (res.ok) {
            const data = await res.json();
            setSummary(data.summary);
            setStats(data.stats);
          }
        } catch (err) {
          console.error("Failed to fetch stats", err);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [open, period, session?.user?.id]);

  const formatPeriod = (dateStr: string) => {
    const date = new Date(dateStr);
    if (period === "day") {
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    if (period === "week") {
      return `Week of ${date.toLocaleDateString()}`;
    }
    return date.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  };

  const formatMinutes = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.round(totalMinutes % 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m}m`;
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-sm transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        <span className="hidden sm:inline">Report</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-[#ba4949] text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Activity Report</h2>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center border border-gray-100 transition-transform hover:scale-105">
                  <div className="text-2xl font-bold text-[#ba4949]">
                    {(summary?.total_focus_minutes || 0) / 60 >= 1
                      ? ((summary?.total_focus_minutes || 0) / 60).toFixed(1)
                      : summary?.total_focus_minutes || 0}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    {(summary?.total_focus_minutes || 0) / 60 >= 1
                      ? "Hours"
                      : "Minutes"}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center border border-gray-100 transition-transform hover:scale-105">
                  <div className="text-2xl font-bold text-[#ba4949]">
                    {summary?.total_sessions || 0}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    Sessions
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center border border-gray-100 transition-transform hover:scale-105">
                  <div className="text-2xl font-bold text-[#ba4949]">
                    {summary?.current_streak || 0}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    Day Streak
                  </div>
                </div>
              </div>

              {/* Focus Activity History */}
              <div className="mb-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Focus History</h3>
                  <div className="bg-gray-200 p-1 rounded-md flex gap-1">
                    <button
                      onClick={() => setPeriod("day")}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        period === "day"
                          ? "bg-white text-black shadow-sm font-bold"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      Day
                    </button>
                    <button
                      onClick={() => setPeriod("week")}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        period === "week"
                          ? "bg-white text-black shadow-sm font-bold"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setPeriod("month")}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        period === "month"
                          ? "bg-white text-black shadow-sm font-bold"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      Month
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="w-8 h-8 border-4 border-[#ba4949] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : stats.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {stats.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center group hover:border-[#ba4949]/30 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-gray-800">
                            {formatPeriod(item.period)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.session_count} sessions
                          </div>
                        </div>
                        <div className="text-lg font-bold text-[#ba4949]">
                          {formatMinutes(item.total_focus_minutes)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-400">No activity recorded yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-t flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-800 text-white px-6 py-2 rounded-md font-bold hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
