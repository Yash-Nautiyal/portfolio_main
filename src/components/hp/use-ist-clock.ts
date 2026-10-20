"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};

const fmt = (opts: Intl.DateTimeFormatOptions) => () =>
  new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", ...opts });

const time = fmt({ hour: "2-digit", minute: "2-digit" });
const date = fmt({ weekday: "long", day: "numeric", month: "long" });

/** Live India time. Renders "" on the server so hydration never mismatches. */
export function useIstClock() {
  return {
    time: useSyncExternalStore(subscribe, time, () => ""),
    date: useSyncExternalStore(subscribe, date, () => ""),
  };
}
