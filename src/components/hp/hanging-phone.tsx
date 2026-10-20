"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import s from "./home.module.css";
import type { DeviceId, PhoneMotion } from "./phone-context";
import type { Body } from "./phone-scene";

export type { Body };

// WebGL only runs in the browser; the stage chrome renders on the server.
const noop = () => () => {};

const PhoneScene = dynamic(() => import("./phone-scene"), { ssr: false });

/**
 * The lanyard stage: a phone and a work pass hanging from one ring, rendered in WebGL
 * (phone-scene.tsx), with real rigid-body physics. Grab a body to swing or throw it; drag a strap or the
 * empty stage to spin the lanyard.
 * Tapping the pass brings it forward; tapping the phone (anywhere) while the pass is forward
 * sends the pass back.
 */
export function HangingPhone({
  dropped,
  motionRef,
  overlay,
  passJob = 0,
  device = "pixel",
  passForward = false,
  passFlipped = false,
  onTap,
  onPassFace,
  children,
}: {
  dropped: boolean;
  motionRef?: React.RefObject<PhoneMotion | null>;
  overlay?: React.ReactNode;
  passJob?: number;
  device?: DeviceId;
  passForward?: boolean;
  passFlipped?: boolean;
  onTap?: (body: Body) => void;
  /** A spin settled the pass on a face; keep the React flip state in sync. */
  onPassFace?: (flipped: boolean) => void;
  children: React.ReactNode;
}) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  // Host for the live screen. The 3D scene positions it with CSS3DRenderer; React fills it
  // through a portal, so context and state flow normally and remounts are safe.
  const [screen] = useState(() => (typeof document === "undefined" ? null : document.createElement("div")));
  // Portals can't hydrate: render the screen only once the client has taken over.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);

  const caption = passForward
    ? ["Work pass", "Tap the pass to flip it · tap the phone to put it back"]
    : ["Yash's phone", "Grab and throw the phone or pass · drag a strap to spin · tap the pass"];

  return (
    <div
      ref={setStage}
      className={s.stage}
      data-stage
      data-widget="Stack"
      data-dropped={dropped || undefined}
      data-pass-forward={passForward || undefined}
    >
      <div className={s.stageGlow} aria-hidden />
      <div className={s.dotGrid} aria-hidden />
      {hydrated &&
        screen &&
        createPortal(
          <div className={s.screen3d} data-phone-screen data-widget="MaterialApp">
            {children}
          </div>,
          screen,
        )}
      {stage && screen && (
        <PhoneScene
          stage={stage}
          screen={screen}
          dropped={dropped}
          motionRef={motionRef}
          passJob={passJob}
          device={device}
          passForward={passForward}
          passFlipped={passFlipped}
          onTap={onTap}
          onPassFace={onPassFace}
        />
      )}
      {overlay}
      <p className={s.caption}>
        <b>{caption[0]}</b>
        <span>{caption[1]}</span>
      </p>
    </div>
  );
}
