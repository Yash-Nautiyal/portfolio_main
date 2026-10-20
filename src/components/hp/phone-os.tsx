"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { SiGithub, SiGmail, SiGoogleplay } from "react-icons/si";
import { FileText, Mic, ScanSearch } from "lucide-react";
import { BUILDS, type Build, type Tap } from "@/data/builds";
import { EXPERIENCE, SKILLS, type SkillNames } from "@/data/experience";
import s from "./home.module.css";
import { AppIcon } from "./app-icon";
import { LockScreen } from "./lock-screen";
import { CareerScreen, ComposeScreen, CvScreen, GithubScreen, LinkedinScreen, SkillScreen, StoreScreen } from "./phone-apps";
import { config } from "@/data/config";
import { usePhone, type Screen } from "./phone-context";
import { useIstClock } from "./use-ist-clock";

/** Android: wifi, signal, upright battery. iOS: signal bars, wifi, landscape battery. */
function StatusIcons({ android }: { android: boolean }) {
  return android ? (
    <span className={s.statusIcons} aria-hidden>
      <svg viewBox="0 0 24 24"><path d="M12 21 1 8.5a16 16 0 0 1 22 0Z" /></svg>
      <svg viewBox="0 0 24 24"><path d="M22 2v20H2Z" /></svg>
      <svg viewBox="0 0 24 24"><path d="M10 2h4v2h1.5A1.5 1.5 0 0 1 17 5.5v15a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20.5v-15A1.5 1.5 0 0 1 8.5 4H10Z" /></svg>
    </span>
  ) : (
    <span className={s.statusIcons} aria-hidden>
      <svg viewBox="0 0 18 12"><rect y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" width="3" height="12" rx="1" /></svg>
      <svg viewBox="0 0 16 12"><path d="M8 12 .6 4.4a10.6 10.6 0 0 1 14.8 0Z" /></svg>
      <svg viewBox="0 0 27 13" className={s.battery}><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".45" /><rect x="2" y="2" width="17" height="9" rx="2" /><rect x="25" y="4.5" width="1.6" height="4" rx=".8" opacity=".45" /></svg>
    </span>
  );
}

function StatusBar() {
  const { time } = useIstClock();
  const { device } = usePhone();
  return (
    <div className={s.statusBar}>
      <span>{time}</span>
      <StatusIcons android={device !== "iphone"} />
    </div>
  );
}

function HomeBar() {
  const { go } = usePhone();
  return (
    <button type="button" className={s.homeBar} aria-label="Go to home screen" onClick={() => go({ name: "home" })} />
  );
}

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const DOCK: { label: string; bg: string; icon: React.ReactNode; screen: Screen }[] = [
  { label: "Message Yash", bg: "#ea4335", icon: <SiGmail />, screen: { name: "compose" } },
  { label: "GitHub", bg: "#24292f", icon: <SiGithub />, screen: { name: "github" } },
  { label: "LinkedIn", bg: "#0a66c2", icon: <FaLinkedinIn />, screen: { name: "linkedin" } },
  { label: "Google Play", bg: "#01875f", icon: <SiGoogleplay />, screen: { name: "store" } },
  { label: "Resume", bg: "#0d3550", icon: <FileText />, screen: { name: "cv" } },
];

function HomeScreen() {
  const { go, run, showPass, device } = usePhone();
  const { time, date } = useIstClock();
  const job = EXPERIENCE[0];
  return (
    <div className={s.home}>
      <div className={s.glance}>
        <b>{time}</b>
        <span>{date}</span>
        {job && (
          <span className={s.glanceJob}>
            Building at {job.company}
          </span>
        )}
      </div>
      <ul className={s.appGrid}>
        {BUILDS.map((b, i) => (
          <li key={b.id} style={{ "--n": i } as React.CSSProperties}>
            <button type="button" className={s.appBtn} onClick={() => run(b.id)}>
              <AppIcon build={b} className={s.appSquircle} />
              <span className={s.appLabel}>{b.title}</span>
            </button>
          </li>
        ))}
        <li style={{ "--n": BUILDS.length } as React.CSSProperties}>
          <button type="button" className={s.appBtn} onClick={() => showPass(0)}>
            <span className={`${s.appSquircle} ${s.careerIcon}`}>ID</span>
            <span className={s.appLabel}>Career</span>
          </button>
        </li>
        <li style={{ "--n": BUILDS.length + 1 } as React.CSSProperties}>
          <button type="button" className={s.appBtn} onClick={() => go({ name: "about" })}>
            <span className={`${s.appSquircle} ${s.aboutIcon}`}>YN</span>
            <span className={s.appLabel}>About me</span>
          </button>
        </li>
      </ul>
      <nav className={s.dock} aria-label="Dock">
        {DOCK.map((d) => (
          <button
            key={d.label}
            type="button"
            aria-label={d.label}
            style={{ background: d.bg }}
            onClick={() => go(d.screen)}
          >
            {d.icon}
          </button>
        ))}
      </nav>
      {device !== "iphone" ? (
        <div className={s.searchBar} aria-hidden>
          <b>G</b>
          <Mic />
          <ScanSearch />
        </div>
      ) : (
        <div className={s.pageDots} aria-hidden>
          <i data-on />
          <i />
        </div>
      )}
    </div>
  );
}

/** A screenshot at full width with its tap areas on top (positions are % of the image). */
function Shot({ src, alt, taps, onTap, priority }: { src: string; alt: string; taps?: Tap[]; onTap: (to: string) => void; priority?: boolean }) {
  return (
    <div className={s.shot}>
      {/* intrinsic size is only a placeholder ratio: height follows the real image */}
      <Image src={src} alt={alt} width={1080} height={2200} sizes="(max-width: 640px) 60vw, 280px" draggable={false} priority={priority} />
      {taps?.map((t, i) => (
        <button
          key={i}
          type="button"
          className={s.tap}
          aria-label={t.label}
          style={{ left: `${t.at[0]}%`, top: `${t.at[1]}%`, width: `${t.at[2]}%`, height: `${t.at[3]}%` }}
          onClick={() => onTap(t.to)}
        />
      ))}
    </div>
  );
}

/** `stack`: screens opened by a tap, over the swipe row; the last one is showing. `open("back")` closes it. */
function Pager({ build, stack, open }: { build: Build; stack: string[]; open: (to: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  // Mouse drag: sideways turns the page, up/down scrolls the picture under the pointer.
  type Drag = { x: number; y: number; left: number; slide: HTMLElement | null; top: number; axis: "x" | "y" | null };
  const drag = useRef<Drag | null>(null);
  const pushDrag = useRef<{ y: number; top: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const top = stack.at(-1);
  const count = build.screens.length;

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const n = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const el = e.currentTarget;
    const moved = d.axis === "x" ? e.clientX - d.x : 0;
    const w = el.clientWidth;
    const base = Math.round(d.left / w);
    const target = Math.max(0, Math.min(count - 1, Math.abs(moved) > w * 0.15 ? base - Math.sign(moved) : base));
    goTo(target);
    // Snap comes back only once the smooth scroll has landed: switching it on mid-scroll
    // can fight the scroll and leave the pager stuck between two pictures.
    const done = () => {
      if (!drag.current) setDragging(false);
    };
    if (Math.abs(el.scrollLeft - target * w) < 1) done(); // already there (a plain click): no scroll to wait for
    else if ("onscrollend" in el) el.addEventListener("scrollend", done, { once: true });
    else setTimeout(done, 700); // shortcut: no scrollend (older Safari), assume the smooth scroll is done by then
  };

  return (
    <div
      className={s.pagerWrap}
      onKeyDown={(e) => {
        if (e.key === "Escape" && top) {
          e.stopPropagation();
          open("back");
        }
      }}
    >
      <div
        ref={ref}
        inert={!!top}
        className={s.pager}
        data-dragging={dragging || undefined}
        tabIndex={0}
        aria-label={`${build.title} screenshots`}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goTo(index + 1);
          if (e.key === "ArrowLeft") goTo(index - 1);
        }}
        onPointerDown={(e) => {
          // Touch uses native scrolling; mouse and pen get drag-to-scroll. Tap areas stay plain clicks.
          if (e.pointerType === "touch" || (e.target as HTMLElement).closest("button")) return;
          const slide = (e.target as HTMLElement).closest<HTMLElement>(`.${s.slide}`);
          drag.current = { x: e.clientX, y: e.clientY, left: e.currentTarget.scrollLeft, slide, top: slide?.scrollTop ?? 0, axis: null };
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          const dy = e.clientY - d.y;
          // Lock to the first clear direction so a scroll doesn't nudge the page sideways.
          if (!d.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 6) d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
          if (d.axis === "x") e.currentTarget.scrollLeft = d.left - dx;
          else if (d.axis === "y" && d.slide) d.slide.scrollTop = d.top - dy;
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {build.screens.map((src, i) => (
          <div key={src} className={s.slide}>
            <Shot src={src} alt={`${build.title} screen ${i + 1} of ${count}`} taps={build.taps?.[src]} onTap={open} priority={i === 0} />
          </div>
        ))}
      </div>
      {top ? (
        <div key={stack.length} className={s.pushed}>
          <div
            className={s.pushedScroll}
            onPointerDown={(e) => {
              if (e.pointerType === "touch" || (e.target as HTMLElement).closest("button")) return;
              pushDrag.current = { y: e.clientY, top: e.currentTarget.scrollTop };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const d = pushDrag.current;
              if (d) e.currentTarget.scrollTop = d.top - (e.clientY - d.y);
            }}
            onPointerUp={() => (pushDrag.current = null)}
            onPointerCancel={() => (pushDrag.current = null)}
          >
            <Shot src={top} alt={`${build.title} screen`} taps={build.taps?.[top]} onTap={open} />
          </div>
        </div>
      ) : (
        !build.hideDots && (
          <div className={s.pagerDots} aria-hidden>
            {build.screens.map((src, i) => (
              <i key={src} data-on={i === index || undefined} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

function AppScreen({ build }: { build: Build }) {
  const [splash, setSplash] = useState(true);
  const [stack, setStack] = useState<string[]>([]);
  const open = (to: string) => setStack((st) => (to === "back" ? st.slice(0, -1) : [...st, to]));
  useEffect(() => {
    const id = setTimeout(() => setSplash(false), 750);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className={s.app} data-safe={build.surface ? "" : undefined} style={{ "--app": build.color, "--surface": build.surface } as React.CSSProperties}>
      {splash ? (
        <div className={s.splash}>
          <AppIcon build={build} className={s.splashIcon} sizes="160px" />
          <b>{build.title}</b>
        </div>
      ) : (
        <>
          <Pager build={build} stack={stack} open={open} />
          <div className={s.appActions}>
            {/* a tapped-open page shares the one button row, so its end only has to clear this row */}
            {stack.length > 0 && (
              <button type="button" onClick={() => open("back")}>
                ‹ Back
              </button>
            )}
            <Link href={build.href}>Case study</Link>
            {/* icon-only so the row fits the smallest phone, even with Back */}
            {build.live && (
              <a href={build.live} {...ext} className={s.actIcon} aria-label="Google Play" title="Google Play">
                <SiGoogleplay aria-hidden />
              </a>
            )}
            {build.github && (
              <a href={build.github} {...ext} className={s.actIcon} aria-label="Source on GitHub" title="Source on GitHub">
                <SiGithub aria-hidden />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function AboutScreen() {
  const { go } = usePhone();
  const a = config.about;
  return (
    <div className={s.about}>
      <div className={s.aboutHead}>
        <span className={`${s.appSquircle} ${s.aboutIcon} ${s.aboutAvatar}`}>YN</span>
        <b>{config.author}</b>
        <span>
          {a.role} · {a.location}
        </span>
      </div>
      <p className={s.aboutOverview}>{a.overview}</p>
      <dl className={s.aboutList}>
        <div>
          <dt>Education</dt>
          <dd>{a.education}</dd>
        </div>
        <div>
          <dt>Languages</dt>
          <dd>{a.languages}</dd>
        </div>
        <div>
          <dt>State management</dt>
          <dd>{a.stateManagement}</dd>
        </div>
      </dl>
      <p className={s.aboutLabel}>Skills</p>
      <ul className={s.aboutSkills}>
        {(Object.keys(SKILLS) as SkillNames[]).map((id) => (
          <li key={id}>
            <button type="button" onClick={() => go({ name: "skill", id })}>
              {SKILLS[id].label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const LIGHT = new Set<Screen["name"]>(["about", "compose", "linkedin", "store"]);

/** Everything drawn on the phone's screen, switched by the shared phone state. */
export function PhoneOS() {
  const { screen, go, banner, device } = usePhone();
  const build = screen.name === "app" ? BUILDS.find((b) => b.id === screen.id) : undefined;
  // Career keeps one key so switching jobs swaps content instead of reopening the app.
  const key = screen.name === "app" || screen.name === "skill" ? `${screen.name}-${screen.id}` : screen.name;
  const appLike = screen.name !== "lock" && screen.name !== "home";

  return (
    <div
      className={s.os}
      data-device={device}
      data-os={device === "iphone" ? "ios" : "android"}
      data-screen={screen.name}
      data-app={appLike || undefined}
      data-tone={LIGHT.has(screen.name) || build?.tone === "light" ? "light" : undefined}
    >
      {/* full-device captures bring their own status bar */}
      {!(build && !build.surface) && <StatusBar />}
      <div key={key} className={s.view}>
        {screen.name === "lock" && <LockScreen onUnlock={() => go({ name: "home" })} />}
        {screen.name === "home" && <HomeScreen />}
        {screen.name === "about" && <AboutScreen />}
        {screen.name === "skill" && <SkillScreen id={screen.id} />}
        {screen.name === "compose" && <ComposeScreen />}
        {screen.name === "cv" && <CvScreen />}
        {screen.name === "github" && <GithubScreen />}
        {screen.name === "linkedin" && <LinkedinScreen />}
        {screen.name === "store" && <StoreScreen />}
        {screen.name === "career" && <CareerScreen job={screen.job} />}
        {build && <AppScreen key={build.id} build={build} />}
      </div>
      {banner && (
        <div key={banner.title + banner.body} className={s.banner} role="status">
          <span className={s.notifIcon} aria-hidden>
            YN
          </span>
          <div>
            <b>{banner.title}</b>
            <span>{banner.body}</span>
          </div>
        </div>
      )}
      {screen.name !== "lock" && <HomeBar />}
    </div>
  );
}
