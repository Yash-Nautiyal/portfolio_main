"use client";

import { useRef } from "react";
import { SkillNames, SKILLS } from "@/data/experience";
import s from "./home.module.css";
import { usePhone, type Screen } from "./phone-context";

const CHIPS = [
  SkillNames.FLUTTER,
  SkillNames.DART,
  SkillNames.SUPABASE,
  SkillNames.FIREBASE,
  SkillNames.POSTGRES,
  SkillNames.ANDROID,
];

const stageEl = () => document.querySelector<HTMLElement>("[data-stage]");
const over = (el: HTMLElement | null, x: number, y: number) => {
  const r = el?.getBoundingClientRect();
  return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
};

/**
 * Skill chips are Draggables; the phone stage is the DragTarget.
 * Drop (or click / Enter) opens the skill on the phone.
 */
export function SkillChips() {
  const { go, kick } = usePhone();
  const drag = useRef<{ x: number; y: number; ghost: HTMLElement | null; chip: HTMLElement } | null>(null);

  const end = (id: SkillNames, x: number, y: number) => {
    const d = drag.current;
    drag.current = null;
    const stage = stageEl();
    if (stage) {
      delete stage.dataset.dropReady;
      delete stage.dataset.dropOver;
    }
    if (!d) return;
    d.chip.removeAttribute("data-lifted");
    if (!d.ghost) {
      go({ name: "skill", id }); // plain click
      return;
    }
    const hit = over(stage, x, y);
    d.ghost.animate(
      hit
        ? [{ opacity: 1 }, { opacity: 0, transform: `${d.ghost.style.transform} scale(0.4)` }]
        : [{ transform: d.ghost.style.transform }, { transform: "translate(0,0) rotate(0)" }],
      { duration: hit ? 220 : 320, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    ).onfinish = () => d.ghost?.remove();
    if (hit) {
      kick(30);
      go({ name: "skill", id });
    }
  };

  return (
    <ul className={s.chips} aria-label="Skills. Drag one onto the phone, or press it.">
      {CHIPS.map((id) => (
        <li key={id}>
          <button
            type="button"
            className={id === SkillNames.FLUTTER ? `${s.chip} ${s.chipFlutter}` : s.chip}
            onPointerDown={(e) => {
              drag.current = { x: e.clientX, y: e.clientY, ghost: null, chip: e.currentTarget };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d) return;
              const dx = e.clientX - d.x;
              const dy = e.clientY - d.y;
              if (!d.ghost) {
                if (Math.hypot(dx, dy) < 6) return;
                const r = d.chip.getBoundingClientRect();
                const g = d.chip.cloneNode(true) as HTMLElement;
                g.setAttribute("aria-hidden", "true");
                g.classList.add(s.chipGhost);
                Object.assign(g.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px` });
                document.body.appendChild(g);
                d.ghost = g;
                d.chip.dataset.lifted = "";
                const stage = stageEl();
                if (stage) stage.dataset.dropReady = "";
              }
              d.ghost.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-12, Math.min(12, dx / 14))}deg)`;
              const stage = stageEl();
              if (stage) {
                if (over(stage, e.clientX, e.clientY)) stage.dataset.dropOver = "";
                else delete stage.dataset.dropOver;
              }
            }}
            onPointerUp={(e) => end(id, e.clientX, e.clientY)}
            onPointerCancel={() => end(id, -1, -1)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                go({ name: "skill", id });
              }
            }}
          >
            {SKILLS[id].label}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** A honeycomb cell that flies its icon into the phone instead of leaving the site. */
export function HexLink({
  href,
  screen,
  label,
  style,
  centre,
  children,
}: {
  centre?: boolean;
  href: string;
  screen?: Screen;
  label: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  const { flyTo } = usePhone();
  const external = href.startsWith("http") || href.startsWith("mailto:");
  return (
    <a
      className={centre ? `${s.hex} ${s.hexCentre}` : s.hex}
      style={style}
      href={href}
      aria-label={screen ? `${label} (opens on the phone)` : label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        // Modifier clicks keep normal link behaviour.
        if (!screen || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        const icon = e.currentTarget.querySelector<HTMLElement>("[data-fly]") ?? e.currentTarget;
        flyTo(icon, screen);
      }}
    >
      {children}
    </a>
  );
}

export function CtaButtons({ resume }: { resume: string }) {
  const { go, kick, flyTo } = usePhone();
  return (
    <>
      <a
        className={s.btnMain}
        href="/contact"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          // The phone swings towards the visitor, then opens a compose screen.
          kick(-55);
          go({ name: "compose" });
        }}
      >
        Contact me
      </a>
      <a
        className={s.btnAlt}
        href={resume}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          flyTo(e.currentTarget, { name: "cv" });
        }}
      >
        CV
      </a>
    </>
  );
}
