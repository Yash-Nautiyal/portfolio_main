"use client";

import { createContext, useContext } from "react";
import type { SkillNames } from "@/data/experience";

export type Screen =
  | { name: "lock" }
  | { name: "home" }
  | { name: "about" }
  | { name: "app"; id: string }
  | { name: "skill"; id: SkillNames }
  | { name: "compose" }
  | { name: "cv" }
  | { name: "github" }
  | { name: "linkedin" }
  | { name: "store" }
  | { name: "career"; job: number };

/** Imperative hooks into the physics loop (set by HangingPhone). */
export type PhoneMotion = {
  /** Add swing velocity in deg/s. */
  kick: (v: number) => void;
  /** Lean towards a side of the stage (-1..1), or null to follow the pointer again. */
  lean: (x: number | null) => void;
  /** Spin the whole lanyard (deg/s); used to hide a device swap mid-turn. */
  spin: (v: number) => void;
  /** Physics time scale: 0.2 = "Slow animations" (timeDilation 5). */
  timeScale: (s: number) => void;
};

export type Banner = { title: string; body: string };

/** The work ID pass that hangs next to the phone. `job` indexes JOBS. */
export type PassState = { forward: boolean; flipped: boolean; job: number };

export type DeviceId = "pixel" | "iphone" | "tablet";

export type PhoneApi = {
  device: DeviceId;
  screen: Screen;
  banner: Banner | null;
  pass: PassState;
  /** Swing the pass to the front, show job `job`, and open its details on the phone. */
  showPass: (job: number) => void;
  /** Send the pass back behind the phone. */
  hidePass: () => void;
  flipPass: () => void;
  go: (s: Screen) => void;
  /** Install-and-run a build on the phone, like `flutter run`. */
  run: (id: string) => void;
  lean: (x: number | null) => void;
  kick: (v: number) => void;
  /** Fly an element's clone into the phone screen (shared-element style), then open `s`. */
  flyTo: (from: HTMLElement, s: Screen) => void;
  /** Drop a notification banner on the phone. */
  notify: (b: Banner) => void;
};

export const PhoneContext = createContext<PhoneApi | null>(null);

export function usePhone() {
  const api = useContext(PhoneContext);
  if (!api) throw new Error("usePhone must be used inside HomeWindow");
  return api;
}
