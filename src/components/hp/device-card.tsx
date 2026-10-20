"use client";

import { config } from "@/data/config";
import s from "./home.module.css";
import { useIstClock } from "./use-ist-clock";

// A clean street map in the 220×96 viewBox: one main road, a cross of streets meeting at a
// roundabout (108, 60), a few side streets and tidy blocks. The pin (.mapDot) sits on the
// large block around x 136, y 42.
const MAIN_ROAD = "M60 9 C115 3 172 6 200 25 C213 34 218 50 220 66";
const ROADS = "M108 0 V55 M108 65 V96 M60 60 H103 M113 60 H220";
const SIDE_STREETS = "M150 60 V96 M186 60 V96 M108 30 H158 M158 8 V60";
const BLOCKS: [number, number, number, number][] = [
  [76, 16, 26, 36],
  [116, 12, 34, 13],
  [122, 32, 28, 22], // under the pin
  [165, 16, 20, 12],
  [165, 34, 26, 20],
  [76, 67, 26, 22],
  [116, 67, 28, 22],
  [157, 67, 23, 22],
  [193, 67, 22, 22],
];

export function DeviceCard() {
  const { time } = useIstClock();
  return (
    <section data-widget="Row" className={`${s.card} ${s.device}`} style={{ "--i": 1 } as React.CSSProperties}>
      <svg className={s.map} viewBox="0 0 220 96" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {BLOCKS.map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="2" stroke="#ffffff1c" strokeWidth=".7" />
          ))}
          <path d={SIDE_STREETS} stroke="#ffffff26" strokeWidth=".9" />
          <path d={ROADS} stroke="#ffffff38" strokeWidth="1.4" />
          <circle cx="108" cy="60" r="5" stroke="#ffffff38" strokeWidth="1.4" />
          <path d={MAIN_ROAD} stroke="#ffffff52" strokeWidth="2.4" />
        </g>
      </svg>
      <span className={s.mapDot} aria-hidden />
      <div>
        <b>{config.about.location.split(",")[0]}, IN</b>
        <small className={s.mono}>
          {time || "--:--"} IST · Local time
        </small>
      </div>
    </section>
  );
}
