// SRTimeline.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const MS = 24 * 60 * 60 * 1000;

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function fmtNumber(n, digits = 4) { return n.toLocaleString(undefined, { maximumFractionDigits: digits }); }

// Turn milliseconds into "Xd Yh Zm Ws"
function humanDur(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / (60*1000)) % 60;
  const h = Math.floor(ms / (60*60*1000)) % 24;
  const d = Math.floor(ms / MS);
  const parts = [];
  if (d) parts.push(`${d}d`);
  parts.push(`${h}h`, `${m}m`, `${s}s`);
  return parts.join(" ");
}

const MILESTONES = [
  { day: 7, label: "Day 7", copy: "Feeling jittery, slowly withdrawing from the habit of masturbating. You've gone a week retaining your seed, keep going." },
  { day: 15, label: "Day 15", copy: "Halfway through the month, urges are peaking during this time. You must transmute this sexual energy into creative and physical outlets: creating videos, working out, etc." },
  { day: 30, label: "Day 30", copy: "Feeling more confident, can think more clearly, feel bigger, more female attention? Higher focus on goals and less on lust and surface level things." },
  { day: 60, label: "Day 60", copy: "Feeling like a superhero, can think and process things faster. Gaining muscle and looking bigger? Feeling more like a man and less like a cuck." },
  { day: 90, label: "Day 90", copy: "3 months on the journey, wow nice job. Good fortunes, face clear, feel better, energized, optimistic, active." },
  { day: 100, label: "Day 100", copy: "HOLY 100 DAYS! Nice job bro. This is just the beginning. Continue climbing on this path and becoming the best version of yourself." },
  { day: 250, label: "Day 250", copy: "You have become a new person, not worrying so much what others think and instead inspiring others on their own journeys." },
  { day: 365, label: "Day 365", copy: "One whole year. Congrats my guy, reward yourself with 365 pushups as a way to realize how far you have come. You are no longer a slave to your former weak & feeble mind." },
  { day: 500, label: "Day 500", copy: "Halfway to the golden number. Although you have now realized the numbers don’t matter as much as the lifestyle you live. Discipline is much better than the illusion of instant gratification." },
  { day: 1000, label: "Day 1000", copy: "You have come to terms with reality undergoing a full metamorphosis into a limitless version of yourself. Anything is possible as proof of this journey you have undergone. Never stop elevating brother." },
];

export default function SRTimeline() {
  const [startISO, setStartISO] = React.useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("sr_start_date") : null;
    return saved || new Date().toISOString().slice(0, 10);
  });

  const start = React.useMemo(() => new Date(startISO + "T00:00:00"), [startISO]);
  const [now, setNow] = React.useState(() => new Date());

  // tick every second
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("sr_start_date", startISO);
  }, [startISO]);

  const maxDay = MILESTONES[MILESTONES.length - 1].day;

  // exact elapsed time
  const diffMs = now.getTime() - start.getTime();
  const elapsedDaysExact = Math.max(0, diffMs / MS); // fractional days
  const pct = (clamp(elapsedDaysExact, 0, maxDay) / maxDay) * 100;

  const next = MILESTONES.find(m => elapsedDaysExact < m.day);
  const nextEtaMs = next ? (next.day * MS - diffMs) : 0;

  return (
    <div className="w-full rounded-2xl border border-gray-200/70 bg-white/80 dark:bg-gray-800/60 shadow-lg backdrop-blur p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">From Vision to Success — SR Timeline</h2>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm flex items-center gap-2">
            <span className="font-medium">Start date (Day 1):</span>
            <input
              className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              type="date"
              value={startISO}
              onChange={(e) => setStartISO(e.target.value)}
            />
          </label>
          <div className="text-sm flex gap-4">
            <span>
              <strong>{fmtNumber(elapsedDaysExact, 6)}</strong> days elapsed
              <span className="opacity-70"> ({humanDur(diffMs)} since start)</span>
            </span>
            <span>
              Next: <strong>{next ? next.label : "All reached"}</strong>
              {next ? <> in <strong>{humanDur(nextEtaMs)}</strong></> : null}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-4 h-3 rounded-full bg-gray-100 dark:bg-gray-700">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #6A5ACD, #8b5cf6)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute -top-2 w-0 h-0 border-l-4 border-r-4 border-b-8"
          style={{
            left: `${pct}%`,
            transform: "translateX(-50%)",
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: "#6A5ACD",
          }}
          initial={{ left: 0 }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          aria-label="Today's position"
        />
        <div className="absolute inset-0 pointer-events-none">
          {MILESTONES.map((m) => {
            const left = (m.day / maxDay) * 100;
            const past = elapsedDaysExact >= m.day; // ← use elapsedDaysExact
            return (
              <div key={m.day} className="absolute -top-2 text-center" style={{ left: `${left}%`, transform: "translateX(-50%)" }}>
                <div className="w-0.5 h-3 bg-gray-400 mx-auto rounded" />
                <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${past ? "bg-emerald-500" : "bg-gray-400"}`} />
                <div className="text-[11px] mt-1 whitespace-nowrap">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {MILESTONES.map((m) => (
          <li key={m.day} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-900/40">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${elapsedDaysExact >= m.day ? "bg-emerald-500" : "bg-gray-300"}`}
                  title={elapsedDaysExact >= m.day ? "Reached" : "Upcoming"}
                />
                <div className="font-medium">{m.label}</div>
              </div>
              <div className="text-xs opacity-70">{formatTargetDate(start, m.day)}</div>
            </div>
            <MilestoneAccordion reached={elapsedDaysExact >= m.day} label={m.label} copy={m.copy} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatTargetDate(start, day) {
  const d = new Date(start.getTime() + day * MS);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function MilestoneAccordion({ reached, label, copy }) {
  const [open, setOpen] = React.useState(reached);
  React.useEffect(() => setOpen(reached), [reached]);
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="text-sm px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {open ? "Hide details" : "Show details"}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="text-sm leading-relaxed p-2">{copy}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}