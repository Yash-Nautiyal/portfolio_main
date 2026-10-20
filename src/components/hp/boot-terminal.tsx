"use client";

import { useEffect } from "react";
import s from "./home.module.css";

const LINES: [string, string?][] = [
  ["$ flutter run -d yash_portfolio", "cmd"],
  ["Launching lib/main.dart on Yash's phone in release mode…"],
  ["Running Gradle task 'assembleRelease'…   ✓", "ok"],
  ["✓ Built build/app/outputs/flutter-apk/app-release.apk (21.4MB)", "ok"],
  ["Installing app-release.apk…"],
  ["Syncing files to device…"],
];

const DURATION = 1600;

/** `flutter run` intro. Click or any key skips it. */
export function BootTerminal({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(onDone, reduce ? 200 : DURATION);
    window.addEventListener("keydown", onDone, { once: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onDone);
    };
  }, [onDone]);

  return (
    <div className={s.boot} onClick={onDone} role="status" aria-label="Starting the site">
      <div className={s.term}>
        {LINES.map(([text, kind], i) => (
          <p key={i} className={kind ? s[kind] : undefined} style={{ animationDelay: `${i * 210}ms` }}>
            {text}
          </p>
        ))}
        <p className={s.cursor} style={{ animationDelay: `${LINES.length * 210}ms` }} />
      </div>
      <span className={s.skip}>Click or press any key to skip</span>
    </div>
  );
}
