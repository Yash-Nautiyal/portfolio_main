"use client";

import { BUILDS } from "@/data/builds";
import { JOBS } from "@/data/career";
import { AppIcon } from "./app-icon";
import s from "./home.module.css";
import { usePhone } from "./phone-context";

/** Each row installs and runs its build on the hanging phone. */
export function BuildRows() {
  const { run, lean, screen } = usePhone();
  return (
    <>
      {BUILDS.map((b) => {
        const on = screen.name === "app" && screen.id === b.id;
        return (
          <li key={b.id}>
            <button
              type="button"
              className={s.buildRow}
              data-on={on || undefined}
              aria-pressed={on}
              onClick={() => run(b.id)}
              onPointerEnter={() => lean(-0.7)}
              onPointerLeave={() => lean(null)}
              onFocus={() => lean(-0.7)}
              onBlur={() => lean(null)}
            >
              <AppIcon build={b} className={s.buildThumb} sizes="42px" />
              <span>
                <b>{b.title}</b>
                <small>{b.tagline}</small>
              </span>
              <span className={s.runChip} aria-hidden>
                {on ? "Running" : "▶ Run"}
              </span>
            </button>
          </li>
        );
      })}
    </>
  );
}

/** Each job row brings its work pass to the front of the stage. */
export function JobRows() {
  const { showPass, hidePass, lean, pass } = usePhone();
  return (
    <>
      {JOBS.map((j, i) => {
        const on = pass.forward && pass.job === i;
        return (
          <li key={j.id}>
            <button
              type="button"
              className={s.buildRow}
              data-on={on || undefined}
              aria-pressed={on}
              onClick={() => (on ? hidePass() : showPass(i))}
              onPointerEnter={() => lean(-0.7)}
              onPointerLeave={() => lean(null)}
              onFocus={() => lean(-0.7)}
              onBlur={() => lean(null)}
            >
              {j.logo ? (
                <AppIcon build={{ ...j, logo: j.logo }} className={s.buildThumb} sizes="42px" />
              ) : (
                <span className={`${s.buildThumb} ${s.buildMono}`} style={{ background: j.color }}>
                  {j.short}
                </span>
              )}
              <span>
                <b>{j.company}</b>
                <small>
                  {j.title} · {j.span}
                </small>
              </span>
              <span className={s.runChip} aria-hidden>
                {on ? "Showing" : "ID ↗"}
              </span>
            </button>
          </li>
        );
      })}
    </>
  );
}
