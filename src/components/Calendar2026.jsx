import React from "react";

// 2026 calendar with click-to-color (Green/Red/Erase) and localStorage persistence
const YEAR = 2026;
const LS_KEY = "sr_calendar_2026_v1"; // change if you ever want to reset everyone’s data

const DOW = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December",
];

// helpers
function pad2(n) { return String(n).padStart(2, "0"); }
function isoDate(y, mIndex, d) {
  return `${y}-${pad2(mIndex + 1)}-${pad2(d)}`;
}
function daysInMonth(y, mIndex) {
  return new Date(y, mIndex + 1, 0).getDate();
}
function firstDow(y, mIndex) {
  return new Date(y, mIndex, 1).getDay(); // 0=Sun
}

function loadMap() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveMap(map) {
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

export default function Calendar2026() {
  const [paint, setPaint] = React.useState("green"); // "green" | "red" | "erase"
  const [map, setMap] = React.useState(() => (typeof window !== "undefined" ? loadMap() : {}));

  React.useEffect(() => {
    saveMap(map);
  }, [map]);

  function applyColor(dateISO) {
    setMap(prev => {
      const next = { ...prev };
      if (paint === "erase") {
        delete next[dateISO];
      } else {
        next[dateISO] = paint; // "green" or "red"
      }
      return next;
    });
  }

  function clearAll() {
    if (!confirm("Clear all 2026 calendar colors?")) return;
    setMap({});
  }

  function cellClasses(status) {
    // blank default, colored on selection
    if (status === "green") return "bg-emerald-500 text-white border-emerald-600/60";
    if (status === "red") return "bg-red-500 text-white border-red-600/60";
    if (status === "yellow") return "bg-yellow-400 text-white border-yellow-600/60";
    return "bg-white/70 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 border-gray-300/60 dark:border-gray-700/60";
  }

  return (
    <div className="mt-6 w-full rounded-2xl border border-gray-200/70 bg-white/80 dark:bg-gray-800/60 shadow-lg backdrop-blur p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold">2026 Calendar</h3>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm opacity-80 mr-1">Paint:</span>

          <button
            className={`px-3 py-1.5 rounded-md border text-sm transition ${
              paint === "green"
                ? "bg-emerald-600 text-white border-emerald-700"
                : "bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100/60 dark:hover:bg-gray-900/40"
            }`}
            onClick={() => setPaint("green")}
          >
            Green
          </button>

          <button
            className={`px-3 py-1.5 rounded-md border text-sm transition ${
              paint === "red"
                ? "bg-red-600 text-white border-red-700"
                : "bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100/60 dark:hover:bg-gray-900/40"
            }`}
            onClick={() => setPaint("red")}
          >
            Red
          </button>

          <button
            className={`px-3 py-1.5 rounded-md border text-sm transition ${
              paint === "yellow"
                ? "bg-yellow-400 text-white border-yellow-700"
                : "bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100/60 dark:hover:bg-gray-900/40"
            }`}
            onClick={() => setPaint("yellow")}
          >
            Yellow
          </button>

          <button
            className={`px-3 py-1.5 rounded-md border text-sm transition ${
              paint === "erase"
                ? "bg-gray-700 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:border-gray-200"
                : "bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100/60 dark:hover:bg-gray-900/40"
            }`}
            onClick={() => setPaint("erase")}
          >
            Erase
          </button>

          <button
            className="ml-2 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100/60 dark:hover:bg-gray-900/40 transition"
            onClick={clearAll}
          >
            Clear all
          </button>
        </div>
      </div>

      {/* 12 months: 3 columns x 4 rows */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {MONTH_NAMES.map((name, mIndex) => {
          const dim = daysInMonth(YEAR, mIndex);
          const offset = firstDow(YEAR, mIndex); // blanks before day 1

          // build 42 cells (6 weeks x 7 days), like typical calendar blocks
          const cells = [];
          for (let i = 0; i < 42; i++) {
            const dayNum = i - offset + 1;
            if (dayNum < 1 || dayNum > dim) {
              cells.push({ kind: "empty", key: `e-${mIndex}-${i}` });
            } else {
              const dateISO = isoDate(YEAR, mIndex, dayNum);
              cells.push({
                kind: "day",
                key: dateISO,
                dayNum,
                dateISO,
                status: map[dateISO], // "green" | "red" | undefined
              });
            }
          }

          return (
            <div key={name} className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 overflow-hidden">
              <div className="px-3 py-2 text-center font-semibold bg-gray-100/70 dark:bg-gray-900/50">
                {name} {YEAR}
              </div>

              {/* day-of-week header */}
              <div className="grid grid-cols-7 text-xs font-semibold">
                {DOW.map((d) => (
                  <div
                    key={d}
                    className="py-1 text-center border-t border-b border-gray-200/70 dark:border-gray-700/70 bg-white/60 dark:bg-gray-900/30"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* day cells */}
              <div className="grid grid-cols-7">
                {cells.map((cell) => {
                  if (cell.kind === "empty") {
                    return (
                      <div
                        key={cell.key}
                        className="h-8 border border-gray-200/40 dark:border-gray-700/40 bg-white/30 dark:bg-gray-900/20"
                      />
                    );
                  }

                  return (
                    <button
                      key={cell.key}
                      type="button"
                      onClick={() => applyColor(cell.dateISO)}
                      title={`${cell.dateISO} (${cell.status ?? "blank"})`}
                      className={[
                        "h-8 border text-xs flex items-center justify-center",
                        "hover:brightness-95 active:scale-[0.98] transition",
                        cellClasses(cell.status),
                      ].join(" ")}
                    >
                      {/* If you truly want numbers hidden, replace {cell.dayNum} with "" */}
                      {cell.dayNum}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-xs opacity-75">
        Tip: Select a color above, then click any day to paint it. Your choices save automatically in this browser.
      </div>
    </div>
  );
}