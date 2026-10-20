import type { ReactNode } from "react";
import s from "./case-study.module.css";

/** The home page's IDE window, reused as the case study frame. */
export function CaseWindow({
  path,
  tools,
  color,
  children,
}: {
  path: string;
  tools?: ReactNode;
  color?: string;
  children: ReactNode;
}) {
  return (
    <main className={s.page} style={{ "--app": color } as React.CSSProperties}>
      <div className={s.wallpaper} aria-hidden />
      <div className={s.win}>
        <header className={s.toolbar}>
          <span className={s.lights} aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className={s.path}>{path}</span>
          <span className={s.spacer} />
          {tools}
        </header>
        {children}
      </div>
    </main>
  );
}
