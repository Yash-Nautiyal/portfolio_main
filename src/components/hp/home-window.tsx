"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bug, RotateCcw, Snail, Zap } from "lucide-react";
import { BUILDS } from "@/data/builds";
import { JOBS } from "@/data/career";
import s from "./home.module.css";
import { BootTerminal } from "./boot-terminal";
import { HangingPhone } from "./hanging-phone";
import { PhoneOS } from "./phone-os";
import { PhoneContext, type Banner, type DeviceId, type PassState, type PhoneApi, type PhoneMotion, type Screen } from "./phone-context";

const INSTALL_MS = 650;

const DEVICES: { id: DeviceId; label: string; os: string }[] = [
  { id: "pixel", label: "Pixel 8", os: "Android" },
  { id: "iphone", label: "iPhone 15", os: "iOS" },
  { id: "tablet", label: "Pixel Tablet", os: "Android" },
];

// Hot reload cycles these. Phone state is untouched: only CSS variables change.
const THEMES: Record<string, string>[] = [
  { "--wp-a": "#1e7bff", "--wp-b": "#7a3cff", "--wp-c": "#ff2d6f", "--wp-d": "#ff7a2d", "--wp-base": "#1a1030", "--glow-a": "#2f9e5b", "--glow-b": "#2348c9" },
  { "--wp-a": "#ff7a2d", "--wp-b": "#ff2d6f", "--wp-c": "#7a3cff", "--wp-d": "#ffca28", "--wp-base": "#2a0f1a", "--glow-a": "#c2410c", "--glow-b": "#be185d" },
  { "--wp-a": "#00b4ab", "--wp-b": "#2563eb", "--wp-c": "#22c55e", "--wp-d": "#54c5f8", "--wp-base": "#06202a", "--glow-a": "#0f766e", "--glow-b": "#1d4ed8" },
  { "--wp-a": "#64748b", "--wp-b": "#54c5f8", "--wp-c": "#334155", "--wp-d": "#94a3b8", "--wp-base": "#0b0f14", "--glow-a": "#334155", "--glow-b": "#0369a1" },
];
// Flutter's own hot-reload line, with plausible timings that vary per reload.
const RELOAD_MS = [212, 187, 241, 199, 176];

/**
 * The bento window. Owns boot and phone state; cards come in as server-rendered slots
 * and talk to the phone through PhoneContext.
 */
export function HomeWindow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<Screen>({ name: "lock" });
  const [toast, setToast] = useState<{ id: number; text: React.ReactNode } | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [pass, setPass] = useState<PassState>({ forward: false, flipped: false, job: 0 });
  const [device, setDevice] = useState<DeviceId>("pixel");
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState(0);
  const [flash, setFlash] = useState(0);
  const [debug, setDebug] = useState(false);
  const [slow, setSlow] = useState(false);
  const reloads = useRef(0);
  // Latest handlers for the keyboard shortcuts (kept in a ref so the listener never re-binds).
  const keys = useRef({ reload: () => {}, restart: () => {}, paint: () => {} });

  const motion = useRef<PhoneMotion | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const done = useCallback(() => setReady(true), []);

  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const toastSeq = useRef(0);
  const showToast = (text: React.ReactNode, ms = 1800) => {
    const id = ++toastSeq.current;
    setToast({ id, text });
    later(() => setToast((t) => (t?.id === id ? null : t)), ms);
  };

  const go = (next: Screen) => {
    clearTimers();
    setScreen(next);
    // Leaving the career screen sends the pass back behind the phone.
    if (next.name !== "career") setPass((p) => (p.forward ? { ...p, forward: false, flipped: false } : p));
  };

  const showPass = (job: number) => {
    clearTimers();
    setScreen({ name: "career", job });
    // Coming forward from behind, the pass turns over to the numbers in mid-air on its way round.
    if (!pass.forward) {
      setPass({ forward: true, flipped: true, job });
      return;
    }
    setPass({ forward: true, flipped: false, job });
    // Already in front: show the new job's front first, then turn it over to the numbers.
    later(() => setPass((p) => (p.forward && p.job === job ? { ...p, flipped: true } : p)), 900);
  };
  const hidePass = () => {
    clearTimers();
    setPass((p) => ({ ...p, forward: false, flipped: false }));
  };

  // React Compiler memoizes this object; no useMemo needed.
  const api: PhoneApi = {
    device,
    screen,
    banner,
    pass,
    showPass,
    hidePass,
    flipPass: () => setPass((p) => ({ ...p, flipped: !p.flipped })),
    go,
    kick: (v) => motion.current?.kick(v),
    flyTo: (from, next) => {
      const target = document.querySelector<HTMLElement>("[data-phone-screen]");
      if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        go(next);
        return;
      }
      clearTimers();
      const a = from.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const ghost = from.cloneNode(true) as HTMLElement;
      ghost.removeAttribute("id");
      ghost.setAttribute("aria-hidden", "true");
      Object.assign(ghost.style, {
        position: "fixed",
        left: `${a.left}px`,
        top: `${a.top}px`,
        width: `${a.width}px`,
        height: `${a.height}px`,
        margin: "0",
        zIndex: "60",
        pointerEvents: "none",
      });
      document.body.appendChild(ghost);
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      // Arc: rise above the straight line, then shrink into the screen.
      const anim = ghost.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 70}px) scale(1.35)`, opacity: 1, offset: 0.55 },
          { transform: `translate(${dx * 0.92}px, ${dy * 0.92}px) scale(0.9)`, opacity: 1, offset: 0.85 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0 },
        ],
        { duration: 560, easing: "cubic-bezier(0.3, 0.7, 0.2, 1)" },
      );
      anim.onfinish = () => ghost.remove();
      later(() => {
        motion.current?.kick(dx > 0 ? -40 : 40);
        setScreen(next);
      }, 400);
    },
    notify: (b) => {
      setBanner(b);
      motion.current?.kick(35);
      navigator.vibrate?.(60);
      // Own timer: navigation clears `later` timers, but the banner should still leave.
      setTimeout(() => setBanner((cur) => (cur === b ? null : cur)), 3400);
    },
    run: (id) => {
      const build = BUILDS.find((b) => b.id === id);
      if (!build) return;
      clearTimers();
      motion.current?.kick(screen.name === "app" ? -60 : 45);
      if (screen.name === "app" && screen.id === id) return;
      showToast(
        <>
          <span className={s.ok}>✓</span> Installing {build.short.toLowerCase()}.apk on Yash&apos;s phone…
        </>,
      );
      later(() => setScreen({ name: "app", id }), INSTALL_MS);
    },
    lean: (x) => motion.current?.lean(x),
  };

  // Escape steps back like the Android back gesture.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPass((p) => (p.forward ? { ...p, forward: false, flipped: false } : p));
      setScreen((sc) => (sc.name === "lock" || sc.name === "home" ? sc : { name: "home" }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Slow animations (Flutter's timeDilation = 5): every CSS animation/transition and the physics run at 1/5.
  useEffect(() => {
    const rate = slow ? 0.2 : 1;
    motion.current?.timeScale(rate);
    const apply = () => document.getAnimations().forEach((a) => (a.playbackRate = rate));
    apply();
    if (!slow) return;
    const id = setInterval(apply, 150); // catch animations that start later
    return () => clearInterval(id);
  }, [slow]);

  // `flutter run` keys: r = hot reload, R = hot restart, p = debug paint (ignored while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!ready || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest("input,textarea,[contenteditable]")) return;
      if (e.key === "r") keys.current.reload();
      else if (e.key === "R") keys.current.restart();
      else if (e.key === "p") keys.current.paint();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready]);

  // Close the device menu on outside click / Escape.
  useEffect(() => {
    if (!menu) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent && (e.target as HTMLElement).closest("[data-device-menu]")) return;
      setMenu(false);
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", close);
    };
  }, [menu]);

  const hotReload = () => {
    const n = reloads.current++;
    setTheme((i) => (i + 1) % THEMES.length);
    setFlash((f) => f + 1);
    const ms = RELOAD_MS[n % RELOAD_MS.length];
    showToast(
      <>
        <span className={s.hotText}>⚡</span> Reloaded 1 of 642 libraries in {ms}ms (compile: {Math.round(ms * 0.17)} ms, reload:{" "}
        {Math.round(ms * 0.41)} ms, reassemble: {ms - Math.round(ms * 0.17) - Math.round(ms * 0.41)} ms).
      </>,
      2600,
    );
  };

  const pickDevice = (id: DeviceId) => {
    setMenu(false);
    if (id === device) return;
    const d = DEVICES.find((x) => x.id === id)!;
    // Swap the model while it's edge-on in a spin, so the change reads as a turn, not a pop.
    motion.current?.spin(900);
    later(() => setDevice(id), 110);
    showToast(
      <>
        <span className={s.ok}>✓</span> Connected to {d.label} ({d.os}). Syncing files…
      </>,
    );
  };

  const toggleSlow = () => {
    const next = !slow;
    setSlow(next);
    showToast(<>timeDilation = {next ? "5.0" : "1.0"}</>, 1600);
  };

  const restart = () => {
    clearTimers();
    setToast(null);
    setBanner(null);
    setPass({ forward: false, flipped: false, job: 0 });
    setScreen({ name: "lock" });
    setReady(false);
    setRun((r) => r + 1);
  };

  useEffect(() => {
    keys.current = { reload: hotReload, restart, paint: () => setDebug((v) => !v) };
  });

  return (
    <PhoneContext.Provider value={api}>
      <div className={s.page} style={THEMES[theme] as React.CSSProperties}>
        <div className={s.wallpaper} aria-hidden />
        <div className={s.win} data-ready={ready || undefined} data-debug={debug || undefined}>
          {flash > 0 && <div key={flash} className={s.reloadFlash} aria-hidden />}
          <header className={s.toolbar} data-widget="AppBar">
            <span className={s.lights} aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className={s.path}>yash_nautiyal / lib / main.dart</span>
            <span className={s.spacer} />
            <span className={s.deviceWrap} data-device-menu>
              <button
                type="button"
                className={`${s.tool} ${s.deviceTool}`}
                aria-haspopup="menu"
                aria-expanded={menu}
                onClick={() => setMenu((m) => !m)}
              >
                <i aria-hidden /> {DEVICES.find((x) => x.id === device)!.label} ▾
              </button>
              {menu && (
                <span className={s.deviceMenu} role="menu">
                  {DEVICES.map((x) => (
                    <button key={x.id} type="button" role="menuitemradio" aria-checked={x.id === device} onClick={() => pickDevice(x.id)}>
                      <i aria-hidden />
                      {x.label}
                      <small>{x.os}</small>
                    </button>
                  ))}
                </span>
              )}
            </span>
            <button type="button" className={`${s.tool} ${s.hot}`} onClick={hotReload} title="Hot reload (r)">
              <Zap size={13} aria-hidden /> <span>Hot reload</span>
            </button>
            <button type="button" className={s.tool} onClick={restart} title="Hot restart (R)">
              <RotateCcw size={13} aria-hidden /> <span>Restart</span>
            </button>
            <button type="button" className={s.tool} aria-pressed={debug} onClick={() => setDebug((v) => !v)} title="Debug paint (p)">
              <Bug size={13} aria-hidden /> <span>Debug paint</span>
            </button>
            <button type="button" className={s.tool} aria-pressed={slow} onClick={toggleSlow} title="Slow animations">
              <Snail size={13} aria-hidden /> <span>Slow</span>
            </button>
          </header>

          <div className={s.grid}>
            {/* Restart re-keys the cards (replays their entrance); the WebGL stage stays mounted. */}
            <div key={`l${run}`} className={s.col}>
              {left}
            </div>
            <HangingPhone
              dropped={ready}
              motionRef={motion}
              passJob={pass.job}
              device={device}
              passForward={pass.forward}
              passFlipped={pass.flipped}
              onTap={(body) => {
                if (body === "pass") {
                  if (pass.forward) api.flipPass();
                  else showPass(pass.job);
                  return;
                }
                // Tapping the phone puts the pass back; no separate button needed.
                if (pass.forward) hidePass();
              }}
              onPassFace={(flipped) => setPass((p) => ({ ...p, flipped }))}
              overlay={
                <>
                  {toast && (
                    <div key={toast.id} className={s.toast} role="status">
                      {toast.text}
                    </div>
                  )}
                  {/* The pass covers the phone's Career tabs, so the switcher moves under the pass. */}
                  {pass.forward && (
                    <div className={s.jobSwitch} role="tablist" aria-label="Jobs">
                      {JOBS.map((j, i) => (
                        <button
                          key={j.id}
                          type="button"
                          role="tab"
                          aria-selected={i === pass.job}
                          style={{ "--job": j.color } as React.CSSProperties}
                          onClick={() => i !== pass.job && showPass(i)}
                        >
                          <i aria-hidden />
                          {j.short}
                          <small>{j.span}</small>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              }
            >
              <PhoneOS />
            </HangingPhone>
            <div key={`r${run}`} className={s.col}>
              {right}
            </div>
          </div>

          {!ready && <BootTerminal key={`boot-${run}`} onDone={done} />}
        </div>
      </div>
    </PhoneContext.Provider>
  );
}
