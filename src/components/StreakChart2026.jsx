import React from "react";

const YEAR = 2026;

function pad2(n) {
  return String(n).padStart(2, "0");
}

function makeIso(year, month, day) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function buildStreakData(dayColors) {
  const data = [];
  let streak = 0;
  let dayOfYear = 0;

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const month = monthIndex + 1;
    const dim = daysInMonth(YEAR, monthIndex);

    for (let day = 1; day <= dim; day++) {
      dayOfYear++;

      const iso = makeIso(YEAR, month, day);
      const status = dayColors[iso];

      if (status === "green") {
        streak += 1;
      } else if (status === "red") {
        streak = 0;
      }

      data.push({
        dayOfYear,
        streak,
        iso,
        status,
      });
    }
  }

  return data;
}

export default function StreakChart2026({ dayColors }) {
  const data = React.useMemo(() => buildStreakData(dayColors), [dayColors]);

  const width = 1000;
  const height = 320;

  const padLeft = 50;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 40;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const maxX = 365;
  const maxY = Math.max(1, ...data.map((d) => d.streak));

  const xToSvg = (x) => padLeft + ((x - 1) / (maxX - 1)) * chartWidth;
  const yToSvg = (y) => padTop + chartHeight - (y / maxY) * chartHeight;

  const linePoints = data
    .map((d) => `${xToSvg(d.dayOfYear)},${yToSvg(d.streak)}`)
    .join(" ");

  const areaPoints = [
    `${xToSvg(1)},${padTop + chartHeight}`,
    ...data.map((d) => `${xToSvg(d.dayOfYear)},${yToSvg(d.streak)}`),
    `${xToSvg(maxX)},${padTop + chartHeight}`,
  ].join(" ");

  const currentStreak = data[data.length - 1]?.streak || 0;
  const bestStreak = Math.max(0, ...data.map((d) => d.streak));
  const greenDays = Object.values(dayColors).filter((v) => v === "green").length;
  const redDays = Object.values(dayColors).filter((v) => v === "red").length;

  const monthTicks = [
    { label: "Jan", day: 1 },
    { label: "Feb", day: 32 },
    { label: "Mar", day: 60 },
    { label: "Apr", day: 91 },
    { label: "May", day: 121 },
    { label: "Jun", day: 152 },
    { label: "Jul", day: 182 },
    { label: "Aug", day: 213 },
    { label: "Sep", day: 244 },
    { label: "Oct", day: 274 },
    { label: "Nov", day: 305 },
    { label: "Dec", day: 335 },
  ];

  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) =>
    Math.round((i * maxY) / yTickCount)
  );

  return (
    <div className="w-full rounded-2xl border border-gray-200/70 bg-white/80 dark:bg-gray-800/60 shadow-lg backdrop-blur p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-semibold">2026 SR Streak Graph</h3>

        <div className="text-sm flex flex-wrap gap-4 opacity-90">
          <span>
            <strong>Current streak:</strong> {currentStreak}
          </span>
          <span>
            <strong>Best streak:</strong> {bestStreak}
          </span>
          <span>
            <strong>Green days:</strong> {greenDays}
          </span>
          <span>
            <strong>Red days:</strong> {redDays}
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[800px]">
          <rect
            x={padLeft}
            y={padTop}
            width={chartWidth}
            height={chartHeight}
            rx="10"
            fill="rgba(255,255,255,0.03)"
          />

          {yTicks.map((tick, index) => (
            <g key={`${tick}-${index}`}>
              <line
                x1={padLeft}
                y1={yToSvg(tick)}
                x2={padLeft + chartWidth}
                y2={yToSvg(tick)}
                stroke="rgba(255,255,255,0.10)"
              />
              <text
                x={padLeft - 10}
                y={yToSvg(tick) + 4}
                textAnchor="end"
                fontSize="11"
                fill="currentColor"
                opacity="0.75"
              >
                {tick}
              </text>
            </g>
          ))}

          {monthTicks.map((m) => (
            <g key={m.label}>
              <line
                x1={xToSvg(m.day)}
                y1={padTop}
                x2={xToSvg(m.day)}
                y2={padTop + chartHeight}
                stroke="rgba(255,255,255,0.08)"
              />
              <text
                x={xToSvg(m.day)}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
                opacity="0.75"
              >
                {m.label}
              </text>
            </g>
          ))}

          <polygon points={areaPoints} fill="rgba(16, 185, 129, 0.18)" />

          <polyline
            points={linePoints}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {data.length > 0 && (
            <circle
              cx={xToSvg(data[data.length - 1].dayOfYear)}
              cy={yToSvg(data[data.length - 1].streak)}
              r="5"
              fill="#10b981"
            />
          )}

          <text
            x={width / 2}
            y={height - 2}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            opacity="0.8"
          >
          </text>

          <text
            x={16}
            y={height / 2}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            opacity="0.8"
            transform={`rotate(-90 16 ${height / 2})`}
          >
            Current Streak
          </text>
        </svg>
      </div>

      <p className="text-xs opacity-70 mt-3">
        Green days increase the streak by 1. Red days reset the streak to 0.
        Yellow and blank days do not change the streak.
      </p>
    </div>
  );
}