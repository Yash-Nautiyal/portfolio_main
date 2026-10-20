import type { ReactNode } from "react";
import s from "./case-study.module.css";

/** Primary skill highlight (Flutter blue, like the home's Flutter chip). */
export function HighlightSkill({ children }: { children: ReactNode }) {
  return <span className={s.skill}>{children}</span>;
}

/** Sub-skill / secondary emphasis. */
export function HighlightSubskill({ children }: { children: ReactNode }) {
  return <span className={s.sub}>{children}</span>;
}

/** A titled card in the case study's main column; headings are numbered by CSS. */
export function CaseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={`${s.card} ${s.section}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
