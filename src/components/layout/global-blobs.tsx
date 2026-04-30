"use client";

import { useEffect, useState } from "react";

export function GlobalBlobs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="global-blob global-blob-a"
        style={{ transform: `translate3d(${scrollY * 0.02}px, ${scrollY * 0.12}px, 0)` }}
      />
      <div
        className="global-blob global-blob-b"
        style={{ transform: `translate3d(${-scrollY * 0.015}px, ${scrollY * 0.09}px, 0)` }}
      />
      <div
        className="global-blob global-blob-c"
        style={{ transform: `translate3d(${scrollY * 0.01}px, ${scrollY * 0.07}px, 0)` }}
      />
    </div>
  );
}
