import React from "react";
import SRTimeline from "./components/SRTimeline";
import Calendar2026 from "./components/Calendar2026";

export default function App() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <SRTimeline />
        <Calendar2026 /> {/* <- calendar goes under timeline */}
      </div>
    </div>
  );
}