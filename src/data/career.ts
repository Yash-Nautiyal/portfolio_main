import { EXPERIENCE, type Experience } from "./experience";

// Presentation data for the ID passes. Numbers come straight from the CV bullets in experience.ts.
const META: Record<number, { short: string; color: string; logo: string; stats: { value: string; label: string }[] }> = {
  2: {
    short: "AppX",
    color: "#6d5efc",
    logo: "/assets/experience/appx.png",
    stats: [
      { value: "500+", label: "client apps on the framework" },
      { value: "1L+", label: "users per client app" },
      { value: "1 wk", label: "to a production app" },
    ],
  },
  1: {
    short: "F13",
    color: "#1f9d6a",
    logo: "/assets/experience/f13.png",
    stats: [
      { value: "35%", label: "less memory" },
      { value: "60 FPS", label: "UI rendering" },
      { value: "40%", label: "more engagement" },
    ],
  },
};

export type Job = Experience & {
  short: string;
  color: string;
  logo?: string; // company logo, shown on a white tile
  logoBg: string;
  logoScale: number;
  stats: { value: string; label: string }[];
  current: boolean;
  span: string;
};

const shortEnd = (d: string) => (d.toLowerCase() === "present" ? "now" : d);

/** Newest first, same order as EXPERIENCE. */
export const JOBS: Job[] = EXPERIENCE.map((e) => ({
  ...e,
  short: META[e.id]?.short ?? e.company,
  color: META[e.id]?.color ?? "#54c5f8",
  logo: META[e.id]?.logo,
  logoBg: "#fff",
  logoScale: 0.86,
  stats: META[e.id]?.stats ?? [],
  current: e.endDate.toLowerCase() === "present",
  span: `${e.startDate} – ${shortEnd(e.endDate)}`,
}));
