import type { ReactNode } from "react";

/** Primary skill highlight — uses `.kw` (theme `--accent`). */
export function HighlightSkill({ children }: { children: ReactNode }) {
  return <span className="kw">{children}</span>;
}

/** Sub-skill / secondary emphasis — uses `.kw-num` (theme `--accent-2`). */
export function HighlightSubskill({ children }: { children: ReactNode }) {
  return <span className="kw-num">{children}</span>;
}
