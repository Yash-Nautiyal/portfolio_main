"use client";

import { useRef, useState } from "react";
import { Camera, Flashlight, Lock } from "lucide-react";
import s from "./home.module.css";
import { useIstClock } from "./use-ist-clock";
import { JOBS } from "@/data/career";

const UNLOCK_AT = 0.18; // fraction of screen height

/** Swipe up (or tap the notification / press Enter) to unlock. */
export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { time, date } = useIstClock();
  // Split so Android can stack hours over minutes; iOS puts the colon back in CSS.
  const [hh = " ", mm = ""] = time ? time.split(":") : [];
  const [dy, setDy] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ y: number; h: number } | null>(null);

  const unlock = () => {
    setLeaving(true);
    setTimeout(onUnlock, 260);
  };

  return (
    <div
      className={s.lock}
      data-leaving={leaving || undefined}
      data-dragging={dragging || undefined}
      style={{ transform: leaving ? undefined : `translateY(${dy}px)` }}
      role="button"
      tabIndex={0}
      aria-label="Unlock Yash's phone"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          unlock();
        }
      }}
      onPointerDown={(e) => {
        start.current = { y: e.clientY, h: e.currentTarget.clientHeight };
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (start.current) setDy(Math.min(0, e.clientY - start.current.y));
      }}
      onPointerUp={() => {
        const st = start.current;
        start.current = null;
        setDragging(false);
        if (!st) return;
        // A plain tap (no travel) also unlocks: friendlier on desktop.
        if (-dy > st.h * UNLOCK_AT || Math.abs(dy) < 4) unlock();
        else setDy(0);
      }}
      onPointerCancel={() => {
        start.current = null;
        setDragging(false);
        setDy(0);
      }}
    >
      <Lock className={s.lockGlyph} aria-hidden />
      <div className={s.lockDate}>{date || " "}</div>
      <div className={s.lockTime}>
        <span>{hh}</span>
        <span>{mm}</span>
      </div>
      <div className={s.notif}>
        <span className={s.notifIcon} aria-hidden>
          YN
        </span>
        <div>
          <b>
            Yash Nautiyal <small>now</small>
          </b>
          <span>{JOBS[0] ? `${JOBS[0].title} at ${JOBS[0].company}` : "Flutter Developer"}</span>
        </div>
      </div>
      <div className={s.swipeHint} aria-hidden>
        <span>⌃</span>
        Swipe up to open
      </div>
      <div className={s.lockShortcuts} aria-hidden>
        <Flashlight />
        <Camera />
      </div>
    </div>
  );
}
