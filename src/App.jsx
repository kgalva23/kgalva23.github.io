import React from "react";
import SRTimeline from "./components/SRTimeline.jsx";
import Calendar2026 from "./components/Calendar2026.jsx";
import StreakChart2026 from "./components/StreakChart2026.jsx";

const LS_KEY = "sr_calendar_2026_v1";

export default function App() {
  const [dayColors, setDayColors] = React.useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(dayColors));
  }, [dayColors]);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <SRTimeline />

        <StreakChart2026 dayColors={dayColors} />

        <Calendar2026
          dayColors={dayColors}
          setDayColors={setDayColors}
        />
      </div>
    </div>
  );
}