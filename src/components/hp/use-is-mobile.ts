"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 767px)";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True below 768px, where the page itself becomes the phone. False on the server (desktop markup first). */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
