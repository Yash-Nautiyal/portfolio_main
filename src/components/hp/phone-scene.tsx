"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, Text } from "@react-three/drei";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { JOBS } from "@/data/career";
import { SKILLS } from "@/data/experience";
import s from "./home.module.css";
import type { PhoneMotion } from "./phone-context";

/*
 * The lanyard scene in real WebGL. World units are CSS pixels (camera distance is solved
 * so z=0 maps 1:1 to the stage), which lets the live phone screen sit exactly on the 3D glass:
 * the screen is a normal React portal (owned by HangingPhone) placed with three's CSS3DRenderer
 * under the canvas, and a mesh punches a transparent hole in the canvas where it shows.
 * Motion is the same hand-tuned pendulum model as before, ported to useFrame.
 */

export type Body = "phone" | "pass";

type Spring = { x: number; v: number };
const step = (o: Spring, target: number, k: number, c: number, dt: number) => {
  o.v += ((target - o.x) * k - o.v * c) * dt;
  o.x += o.v * dt;
};
const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const nearest = (x: number, period: number) => Math.round(x / period) * period;
const rad = THREE.MathUtils.degToRad;

// Swing: two real pendulums on one ring. Gravity pulls each straight down; hanging side by side
// they rest leaning on each other (contact), and knock with a little bounce when swung.
const GRAV = 6200; // px/s^2, tuned so a ~400px hang swings in about 1.6s
const DAMP = 0.85; // 1/s air drag: smooth swings that settle in a few seconds
const MASS_PHONE = 2;
const MASS_PASS = 0.6;
const GAP = 24; // deg: angular width of the two bodies side by side (contact distance)
const GAP_FRONT = 38; // deg: with the pass in front it rests against the phone's left edge, both readable
const PIVOT_Y = 10; // px: shared hang point, just above the stage top (out of view); both straps start here
const MAX_PITCH = 22; // deg: how far the lanyard tilts toward/away on a vertical drag
const BOUNCE = 0.3; // restitution of a knock
const CLEAR = 40; // deg: the pass is past the phone's edge and can change layer
const MAX_OMEGA = 400; // deg/s
// Depth layers (px): about 20 apart, just clear of the phone and pass thickness, so no hollow gap shows
// when the lanyard is turned side-on. Side by side: phone in front, pass just behind. Pass forward: swapped.
const Z_PHONE_BACK = 6;
const Z_PASS_BACK = -14;
const Z_PASS_FRONT = 14;
const Z_PHONE_FRONT_OF_PASS = -6;
const Z_PASS_FRONT_CLEAR = 110; // in front, while the pass turns over it eases forward so its edge never cuts the phone
const Z_PASS_CLEAR = -128; // while the phone spins, the pass eases back so the far edge never cuts it
const FWD_REACH = 32; // deg past CLEAR the hand swings the pass out before bringing it in front
const TUCK_TILT = 80; // deg: going back, the pass tilts its right side forward so it slips behind the phone's edge

const THROW = 0.72; // share of pointer velocity kept on release
const MAX_SWING_V = 230; // deg/s
const SPIN_PER_PX = 0.55; // deg of Y spin per px dragged
const MAX_SPIN_V = 720; // deg/s
const SPIN_FRICTION = 2.4; // 1/s while coasting
const SETTLE_BELOW = 140; // deg/s: slower than this, snap to the nearest face
const FOV = 30;

const FONT = "/fonts/dm-sans-latin-700-normal.woff";
const FONT_REG = "/fonts/dm-sans-latin-400-normal.woff";

function roundedRect(w: number, h: number, r: number) {
  const sh = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  sh.moveTo(x + r, y);
  sh.lineTo(x + w - r, y);
  sh.quadraticCurveTo(x + w, y, x + w, y + r);
  sh.lineTo(x + w, y + h - r);
  sh.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  sh.lineTo(x + r, y + h);
  sh.quadraticCurveTo(x, y + h, x, y + h - r);
  sh.lineTo(x, y + r);
  sh.quadraticCurveTo(x, y, x + r, y);
  return sh;
}

/** Rounded slab with bevelled edges: phone body, camera island, pass holder. */
function slab(w: number, h: number, depth: number, r: number, bevel: number) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - 2 * bevel, h - 2 * bevel, Math.max(0.5, r - bevel)), {
    depth: Math.max(0.1, depth - 2 * bevel),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 5,
    curveSegments: 20,
  });
  g.center();
  return g;
}

export type DeviceId = "pixel" | "iphone" | "tablet";

export type Dims = {
  w: number;
  h: number;
  device: DeviceId;
  pw: number; // body width
  ph: number; // body height
  t: number; // thickness
  r: number; // corner radius
  sw: number; // screen width
  sh: number; // screen height
  sr: number; // screen corner radius
  ui: number; // the --pw the screen UI scales its type by
  gapScale: number; // wider devices need a wider contact gap
};

export function dimsFor(w: number, h: number, device: DeviceId = "pixel"): Dims {
  const base = Math.max(150, Math.min(250, h * 0.27));
  const spec =
    device === "tablet"
      ? { pw: Math.max(200, Math.min(340, h * 0.4)), ar: 1.42, t: 0.035, r: 0.07, bez: 0.045 }
      : device === "iphone"
        ? { pw: base, ar: 2.06, t: 0.055, r: 0.2, bez: 0.036 }
        : { pw: base, ar: 2.12, t: 0.055, r: 0.16, bez: 0.034 };
  const pw = spec.pw;
  const ph = pw * spec.ar;
  const bez = pw * spec.bez;
  const r = pw * spec.r;
  return {
    w,
    h,
    device,
    pw,
    ph,
    t: pw * spec.t,
    r,
    sw: pw - 2 * bez,
    sh: ph - 2 * bez,
    sr: Math.max(4, r - bez * 0.9),
    ui: base,
    gapScale: pw / base,
  };
}

type SceneProps = {
  dropped: boolean;
  motionRef?: React.RefObject<PhoneMotion | null>;
  passJob: number;
  device: DeviceId;
  passForward: boolean;
  passFlipped: boolean;
  onTap?: (body: Body) => void;
  onPassFace?: (flipped: boolean) => void;
  stage: HTMLDivElement;
  /** Imperative host for the live screen; React renders into it through a portal. */
  screen: HTMLDivElement;
};

export default function PhoneScene(props: SceneProps) {
  const { stage } = props;
  return (
    <Canvas
      className={s.canvas}
      eventSource={stage}
      eventPrefix="client"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: FOV, near: 200, far: 6000, position: [0, 0, 1500] }}
      flat={false}
    >
      <Lights />
      <Rig {...props} />
    </Canvas>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[400, 900, 800]} intensity={1.6} />
      <directionalLight position={[-600, -200, 400]} intensity={0.5} color="#9fb6ff" />
      {/* Studio reflections built in code: no HDR download. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -6]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#8fb4ff" position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="circle" intensity={2} position={[0, 0, 8]} scale={3} />
      </Environment>
    </>
  );
}

/* ---------------------------------------------------------------- rig */

function makeSim() {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    reduce,
    swing: { x: 0, v: 0 } as Spring, // phone angle, deg (+ = swings left)
    pSwing: { x: GAP, v: 0 } as Spring, // pass angle
    phz: { x: Z_PHONE_BACK, v: 0 } as Spring, // phone depth
    // Pass layer: "back" side by side, "front" in front of the phone; "toFront"/"toBack" while carried round.
    carry: "back" as "back" | "toFront" | "front" | "toBack",
    carryT: 0,
    settleT: 9, // s since the pass reached its new layer; the hand lowers it gently for a moment
    reached: false, // coming forward: the hand has swung the pass out past the phone's edge
    tuck: false, // going back from the front: tilted until it is behind the phone
    pTilt: { x: 0, v: 0 } as Spring,
    yaw: { x: 0, v: 0 } as Spring,
    pYaw: { x: 0, v: 0 } as Spring,
    tiltX: { x: 0, v: 0 } as Spring,
    tiltY: { x: 0, v: 0 } as Spring,
    drop: { x: 0, v: 0 } as Spring,
    pDrop: { x: 0, v: 0 } as Spring,
    pz: { x: Z_PASS_BACK, v: 0 } as Spring,
    rootYaw: { x: 0, v: 0 } as Spring, // whole lanyard, deg
    rootPitch: { x: 0, v: 0 } as Spring,
    rootCoast: false,
    timeScale: 1, // "Slow animations" (timeDilation)
    clock: 0,
    aimX: 0,
    aimY: 0,
    leanX: null as number | null,
    drag: null as Drag | null,
  };
}

type Drag = {
  body: Body;
  mode: "swing" | "spin";
  grab: number;
  x0: number;
  y0: number;
  start: number;
  startPitch: number;
  last: number;
  t: number;
  moved: number;
  vel: number;
};

function Rig({ dropped, motionRef, passJob, device, passForward, passFlipped, onTap, onPassFace, stage, screen }: SceneProps) {
  const camera = useThree((st) => st.camera as THREE.PerspectiveCamera);
  const size = useThree((st) => st.size);
  const raycaster = useThree((st) => st.raycaster);
  const getState = useThree((st) => st.get);
  const d = useMemo(() => dimsFor(size.width, size.height, device), [size.width, size.height, device]);

  // Camera distance so that z = 0 maps 1:1 to stage pixels.
  useEffect(() => {
    camera.position.set(0, 0, size.height / 2 / Math.tan(rad(FOV / 2)));
    camera.updateProjectionMatrix();
  }, [camera, size.height]);

  const rootRef = useRef<THREE.Group>(null);
  const phonePivot = useRef<THREE.Group>(null);
  const phoneTurn = useRef<THREE.Group>(null);
  const passPivot = useRef<THREE.Group>(null);
  const passTurn = useRef<THREE.Group>(null);
  const holeRef = useRef<THREE.Mesh>(null);
  const screenGroup = useRef<THREE.Group>(null);
  // Imperative three/CSS objects live in a ref, created in an effect, never touched during render.
  const fx = useRef<{
    css: CSS3DRenderer;
    obj: CSS3DObject;
    n: THREE.Vector3;
    p: THREE.Vector3;
    q: THREE.Quaternion;
  } | null>(null);
  const holeGeo = useMemo(
    () => new THREE.ShapeGeometry(roundedRect(d.sw, d.sh, d.sr), 16),
    [d.sw, d.sh, d.sr],
  );
  // Writes alpha 0 (opaque material => NoBlending) so the DOM screen under the canvas shows through,
  // while still depth-testing: anything in front of the screen (the pass) covers it.
  const holeMat = useMemo(
    () => new THREE.ShaderMaterial({ fragmentShader: "void main(){ gl_FragColor = vec4(0.0); }" }),
    [],
  );

  // CSS layer sits under the canvas; the canvas ignores pointer events so the screen gets them.
  useEffect(() => {
    const css = new CSS3DRenderer();
    const obj = new CSS3DObject(screen);
    css.domElement.className = s.cssLayer;
    stage.prepend(css.domElement);
    const group = screenGroup.current;
    group?.add(obj);
    fx.current = { css, obj, n: new THREE.Vector3(), p: new THREE.Vector3(), q: new THREE.Quaternion() };
    return () => {
      group?.remove(obj);
      css.domElement.remove();
      fx.current = null;
    };
  }, [screen, stage]);
  useEffect(() => {
    const f = fx.current;
    if (!f) return;
    f.css.setSize(size.width, size.height);
    const st = f.obj.element.style;
    st.width = `${d.sw}px`;
    st.height = `${d.sh}px`;
    st.setProperty("--pw", `${d.ui}px`);
    st.setProperty("--sr", `${d.sr}px`);
  }, [size.width, size.height, d.sw, d.sh, d.sr, d.ui]);

  const live = useRef({ passForward, passFlipped, onTap, onPassFace });
  useEffect(() => {
    live.current = { passForward, passFlipped, onTap, onPassFace };
  }, [passForward, passFlipped, onTap, onPassFace]);

  // Mutable physics state for the frame loop; never read during render.
  const simRef = useRef(makeSim());

  // shortcut: dev-only debug handle for headless tests (swing/yaw values); remove if tests move to visual diffs.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") (window as unknown as { __hp?: unknown }).__hp = simRef.current;
  }, []);

  // Drop in when the boot finishes.
  useEffect(() => {
    const sim = simRef.current;
    if (!dropped) return;
    // Fresh start (first boot or Restart): level, unspun, then fall in.
    Object.assign(sim, makeSim());
    if (sim.reduce) return;
    const h = getState().size.height;
    sim.drop.x = h * 1.1;
    sim.pDrop.x = h * 1.35;
    sim.swing.v = 55;
    sim.pSwing.v = 30;
  }, [dropped, getState]);

  useEffect(() => {
    const sim = simRef.current;
    if (!motionRef) return;
    motionRef.current = {
      kick: (v) => {
        if (!sim.reduce) sim.swing.v += v * 0.8;
      },
      lean: (x) => {
        sim.leanX = x;
      },
      spin: (v) => {
        if (sim.reduce) return;
        sim.rootYaw.v = v;
        sim.rootCoast = true;
      },
      timeScale: (s) => {
        sim.timeScale = s;
      },
    };
  }, [motionRef]);

  // Gestures: one listener set on the stage; bodies are found by raycasting.
  // Strap / ring / empty stage = swing that body. Phone or pass body = rotate the whole lanyard in 3D.
  useEffect(() => {
    const sim = simRef.current;
    const ndc = new THREE.Vector2();
    const pointerAngle = (e: PointerEvent) => {
      // Pivot is the shared hang point just above the stage top.
      const r = stage.getBoundingClientRect();
      return (-Math.atan2(e.clientX - (r.left + r.width / 2), e.clientY - (r.top - PIVOT_Y)) * 180) / Math.PI;
    };
    const hit = (e: PointerEvent): { body: Body; part: "body" | "strap" } | null => {
      const r = stage.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hits = rootRef.current ? raycaster.intersectObject(rootRef.current, true) : [];
      for (const h of hits) {
        let o: THREE.Object3D | null = h.object;
        while (o) {
          const tag = o.userData.hit as string | undefined;
          if (tag) {
            const [body, part] = tag.split(":") as [Body, "body" | "strap"];
            return { body, part };
          }
          o = o.parent;
        }
      }
      return null;
    };

    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a,button,input,textarea,[role='tab']")) return;
      const onScreen = el.closest("[data-phone-screen]");
      // While the pass is forward, any press on the phone (screen included) is a grab, so a tap puts the pass back.
      if (onScreen && !live.current.passForward) return;
      const h = onScreen ? { body: "phone" as Body, part: "body" as const } : hit(e);
      const body: Body = h?.body ?? "phone";
      const mode = h?.part === "body" ? "spin" : "swing";
      const sp = mode === "spin" ? sim.rootYaw : body === "pass" ? sim.pSwing : sim.swing;
      sim.drag = {
        body,
        mode,
        grab: pointerAngle(e),
        x0: e.clientX,
        y0: e.clientY,
        start: sp.x,
        startPitch: sim.rootPitch.x,
        last: sp.x,
        t: performance.now(),
        moved: 0,
        vel: 0,
      };
      sim.rootCoast = false;
      stage.setPointerCapture(e.pointerId);
      stage.dataset.dragging = "";
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      sim.aimX = (e.clientX - r.left) / r.width - 0.5;
      sim.aimY = (e.clientY - r.top) / r.height - 0.5;
      const dr = sim.drag;
      if (!dr) {
        stage.dataset.hover = hit(e)?.part ?? "";
        return;
      }
      const now = performance.now();
      const dt = Math.max(1, now - dr.t) / 1000;
      let next: number;
      let sp: Spring;
      if (dr.mode === "spin") {
        sp = sim.rootYaw;
        next = dr.start + (e.clientX - dr.x0) * SPIN_PER_PX;
        sim.rootPitch.x = clamp(dr.startPitch - (e.clientY - dr.y0) * 0.25, MAX_PITCH);
        sim.rootPitch.v = 0;
        dr.moved += Math.abs(e.clientY - dr.y0) * 0.01;
      } else {
        sp = dr.body === "pass" ? sim.pSwing : sim.swing;
        next = clamp(dr.start + (pointerAngle(e) - dr.grab), 70);
      }
      dr.moved += Math.abs(next - dr.last);
      dr.vel = dr.vel * 0.6 + ((next - dr.last) / dt) * 0.4;
      sp.x = next;
      sp.v = 0;
      dr.last = next;
      dr.t = now;
    };
    const onUp = () => {
      const dr = sim.drag;
      sim.drag = null;
      delete stage.dataset.dragging;
      if (!dr) return;
      if (dr.moved < 2) {
        live.current.onTap?.(dr.body);
        return;
      }
      const held = performance.now() - dr.t > 120;
      const v = held ? 0 : dr.vel * THROW;
      if (dr.mode === "spin") {
        sim.rootYaw.v = clamp(v, MAX_SPIN_V);
        sim.rootCoast = true;
      } else {
        (dr.body === "pass" ? sim.pSwing : sim.swing).v = clamp(v, MAX_SWING_V);
      }
    };
    const onLeave = () => {
      sim.aimX = 0;
      sim.aimY = 0;
    };
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [stage, camera, raycaster]);

  // Two separate straps drop from one point above the stage.
  const strapLen = Math.max(36, (d.h - d.ph) / 2 - 22);
  const passStrapLen = Math.max(28, (d.h - d.ph) / 2 - 8);
  const passW = d.ui * 0.9; // the pass is a fixed-size badge: same on every device
  const passH = passW * 1.42;

  useFrame((state, delta) => {
    const sim = simRef.current;
    if (!dropped) return;
    const dt = Math.min(0.033, delta) * sim.timeScale;
    sim.clock += dt;
    const now = sim.clock;
    const fwd = live.current.passForward;
    const dr = sim.drag;

    // Carry the pass round the phone like a hand would: out to the side, past the edge, then in front (or back).
    if (fwd && (sim.carry === "back" || sim.carry === "toBack")) {
      sim.carry = "toFront";
      sim.carryT = 0;
      sim.reached = false;
    } else if (!fwd && (sim.carry === "front" || sim.carry === "toFront")) {
      sim.carry = "toBack";
      sim.carryT = 0;
      sim.tuck = sim.pz.x > sim.phz.x;
    }
    if (fwd) sim.tuck = false;
    sim.carryT += dt;
    const sep = sim.pSwing.x - sim.swing.x;
    const clear = CLEAR * d.gapScale;
    const carrying = sim.carry === "toFront" || sim.carry === "toBack";
    // Layer switches once the pass is clear of the phone's edge (or the hand gives up waiting).
    // Coming forward the pass swings wider, so its top corner is past the phone's before it moves in front.
    if (sim.carry === "toFront" && sep > clear + FWD_REACH - 6) sim.reached = true;
    const layerFront = sim.carry === "front" || (sim.carry === "toFront" && (sim.reached || sim.carryT > 2.5));
    const layerBack = sim.carry === "back" || (sim.carry === "toBack" && (sep > clear - 4 || sim.carryT > 2.5));
    // Turning the pass over swings its edges through depth: first move it clear of the phone
    // (forward if it's in front, back if behind), turn it only once clear, then come back.
    const wantFace = live.current.passFlipped ? 180 : 0;
    const faceTarget = nearest(sim.pYaw.x - wantFace, 360) + wantFace;
    const needTurn = Math.abs(sim.pYaw.x - faceTarget) > 3;
    const inFront = sim.pz.x > sim.phz.x;
    // Going back from the front: tilt first, then back (deep, like a flip) while tilted, straighten there.
    const zTarget = sim.tuck
      ? Math.abs(sim.pTilt.x) < TUCK_TILT - 4
        ? sim.pz.x
        : Z_PASS_CLEAR
      : Math.abs(sim.pTilt.x) > 6
        ? Z_PASS_CLEAR
        : sim.carry === "toFront"
          ? layerFront
            ? Z_PASS_FRONT // any turn happens out to the side, in mid-air, so no extra lift is needed
            : sim.pz.x
          : layerFront
            ? needTurn
              ? Z_PASS_FRONT_CLEAR
              : Z_PASS_FRONT
            : layerBack
              ? needTurn
                ? Z_PASS_CLEAR
                : Z_PASS_BACK
              : needTurn
                ? inFront
                  ? Z_PASS_FRONT_CLEAR
                  : Z_PASS_CLEAR
                : sim.pz.x;
    step(sim.pz, zTarget, 38, 9, dt);
    const clearToTurn = Math.abs(sim.pz.x - sim.phz.x) > 60 || sep > clear + 6;
    step(sim.phz, layerFront || sim.tuck ? Z_PHONE_FRONT_OF_PASS : Z_PHONE_BACK, 38, 9, dt);
    if (sim.tuck && sim.pz.x < Z_PASS_CLEAR + 15) sim.tuck = false;
    step(sim.pTilt, sim.tuck ? -TUCK_TILT : 0, 60, 11, dt);
    if (sim.carry === "toFront" && sim.pz.x > sim.phz.x + 12 && !needTurn && Math.abs(sim.pYaw.v) < 20) {
      sim.carry = "front";
      sim.settleT = 0;
    }
    if (sim.carry === "toBack" && sim.pz.x < sim.phz.x - 12) {
      sim.carry = "back";
      sim.settleT = 0;
    }
    sim.settleT += dt;
    // In front, the pass rests against the phone's left edge (wider gap) so both stay readable.
    const gap = (layerFront || sim.tuck ? GAP_FRONT : GAP) * d.gapScale;

    // Gravity pendulums (+ a faint breeze so neither ever looks frozen).
    const lp = strapLen + 14 + d.ph / 2;
    const lc = passStrapLen + 24 + passH / 2;
    const breeze = sim.reduce ? 0 : 1;
    const swingStep = (o: Spring, len: number, phase: number, hand: number | null) => {
      let acc = -(GRAV / len) * Math.sin(rad(o.x)) * (180 / Math.PI) - DAMP * o.v;
      acc += breeze * 6 * Math.sin(now * 0.9 + phase);
      if (hand !== null) acc += (hand - o.x) * 200 - o.v * 13; // held out to the side while carried, firm enough not to sag
      o.v = clamp(o.v + acc * dt, MAX_OMEGA);
      o.x += o.v * dt;
    };
    const handTarget =
      sim.carry === "toFront" || (sim.carry === "toBack" && sim.pz.x > sim.phz.x)
        ? sim.swing.x + clear + (sim.carry === "toFront" ? FWD_REACH : 6)
        : null;
    if (!(dr?.body === "phone" && dr.mode === "swing")) swingStep(sim.swing, lp, 0, null);
    if (!(dr?.body === "pass" && dr.mode === "swing")) {
      swingStep(sim.pSwing, lc, 2.1, handTarget);
      // After a carry the hand lowers the pass to where it hangs instead of dropping it (no big swing).
      const SETTLE = 1.2;
      if (handTarget === null && sim.settleT < SETTLE) {
        const fade = 1 - sim.settleT / SETTLE;
        const restC = layerFront ? gap * 0.56 : sim.swing.x + gap;
        const a = ((restC - sim.pSwing.x) * 30 - sim.pSwing.v * 10) * fade;
        sim.pSwing.v += a * dt;
        sim.pSwing.x += a * dt * dt;
      }
    }

    // Contact in either layer (not while the hand holds the pass out): it can't swing through the phone.
    if (handTarget === null && sim.pSwing.x - sim.swing.x < gap) {
      const pen = gap - (sim.pSwing.x - sim.swing.x);
      const phoneHeld = dr?.body === "phone" && dr.mode === "swing";
      const passHeld = dr?.body === "pass" && dr.mode === "swing";
      // In front the pass leans on the phone face-to-face, so they share the gap evenly (both lean apart);
      // side by side the heavier phone barely moves.
      const mP = layerFront ? 1.3 : MASS_PHONE;
      const mC = layerFront ? 1 : MASS_PASS;
      const wp = phoneHeld ? 0 : passHeld ? 1 : mC / (mP + mC);
      const wc = passHeld ? 0 : phoneHeld ? 1 : mP / (mP + mC);
      // Soft positional fix (avoids snapping when contact re-engages after a carry).
      const k = carrying || sim.settleT < 1.2 ? 0.25 : 1;
      sim.pSwing.x += pen * wc * k;
      sim.swing.x -= pen * wp * k;
      const rel = sim.pSwing.v - sim.swing.v;
      if (rel < 0) {
        const invP = phoneHeld ? 0 : 1 / mP;
        const invC = passHeld ? 0 : 1 / mC;
        const j = (-(1 + BOUNCE) * rel) / (invP + invC || 1);
        sim.pSwing.v += j * invC;
        sim.swing.v -= j * invP;
      }
    }

    // The whole lanyard rotates as one object: coast after a throw, then settle facing front.
    if (!(dr?.mode === "spin")) {
      if (sim.rootCoast) {
        sim.rootYaw.v *= Math.exp(-SPIN_FRICTION * dt);
        sim.rootYaw.x += sim.rootYaw.v * dt;
        if (Math.abs(sim.rootYaw.v) < SETTLE_BELOW) sim.rootCoast = false;
      } else {
        step(sim.rootYaw, nearest(sim.rootYaw.x, 360), 28, 8, dt);
      }
      step(sim.rootPitch, 0, 40, 9, dt);
    }
    // The pass's own turn is only its face (tap to flip).
    // Coming forward, it turns once it's swung out past the phone (mid-air, before it lands in front).
    const canTurn = sim.carry === "toFront" ? layerFront : clearToTurn && !sim.tuck;
    if (canTurn || !needTurn) {
      // Mid-air the turn is quicker and doesn't overshoot, so the pass can land as soon as it's round.
      if (sim.carry === "toFront") step(sim.pYaw, faceTarget, 110, 21, dt);
      else step(sim.pYaw, faceTarget, 60, 10, dt);
    } else sim.pYaw.v = 0; // hold the turn until the pass is clear

    step(sim.tiltX, -sim.aimY * 8, 70, 11, dt);
    step(sim.tiltY, (sim.leanX ?? sim.aimX) * 14, 70, 11, dt);
    step(sim.drop, 0, 110, 11, dt);
    step(sim.pDrop, 0, 90, 10, dt);

    if (rootRef.current) {
      rootRef.current.position.set(0, d.h / 2 + PIVOT_Y + Math.min(sim.drop.x, sim.pDrop.x), 0);
      // Pointer tilt goes on the whole lanyard: tilting bodies separately would cross their edges.
      rootRef.current.rotation.set(rad(sim.rootPitch.x + sim.tiltX.x), rad(sim.rootYaw.x + sim.tiltY.x), 0, "YXZ");
    }
    if (phonePivot.current && phoneTurn.current) {
      phonePivot.current.position.set(0, sim.drop.x - Math.min(sim.drop.x, sim.pDrop.x), sim.phz.x);
      phonePivot.current.rotation.z = -rad(sim.swing.x);
      phoneTurn.current.rotation.set(0, 0, 0);
    }
    if (passPivot.current && passTurn.current) {
      passPivot.current.position.set(0, sim.pDrop.x - Math.min(sim.drop.x, sim.pDrop.x), sim.pz.x);
      passPivot.current.rotation.z = -rad(sim.pSwing.x);
      // Slightly smaller in front, so it fits beside the phone inside the stage.
      const sc = 1 - clamp01((sim.pz.x - Z_PASS_BACK) / (Z_PASS_FRONT - Z_PASS_BACK)) * 0.08;
      passTurn.current.scale.setScalar(sc);
      passTurn.current.rotation.set(0, rad(clamp(sim.pSwing.v * 0.01, 3) + sim.pYaw.x + sim.pTilt.x), 0);
    }
    // Hide the live screen when the phone shows its back.
    const f = fx.current;
    if (f && phoneTurn.current && holeRef.current) {
      phoneTurn.current.getWorldQuaternion(f.q);
      phoneTurn.current.getWorldPosition(f.p);
      f.n.set(0, 0, 1).applyQuaternion(f.q);
      const facing = f.n.dot(f.p.sub(state.camera.position).negate()) > 0;
      holeRef.current.visible = facing;
      f.obj.visible = facing;
      f.css.render(state.scene, state.camera);
    }
  });

  return (
    <>
      <group ref={rootRef} position={[0, d.h * 2, 0]}>
        {/* keyring hinge both straps loop through */}
        {/* pass first: it hangs behind */}
        <group ref={passPivot} position={[0, 0, Z_PASS_BACK]}>
          <Strap length={passStrapLen} width={16} color="#232428" tag="pass:strap" />
          <group position={[0, -passStrapLen, 0]}>
            <Clip w={passW} />
            <group ref={passTurn} position={[0, -24 + passH * 0.13 * 0.42 - passH * 0.13 * 0.12, 0]}>
              <group position={[0, -passH / 2, 0]}>
                <Pass w={passW} h={passH} job={passJob} />
              </group>
            </group>
          </group>
        </group>

        <group ref={phonePivot} position={[0, 0, 0]}>
          <Strap length={strapLen} width={22} color="#16171a" tag="phone:strap" />
          <group position={[0, -strapLen, 0]}>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0, -6, 0]} userData={{ hit: "phone:strap" }}>
              <torusGeometry args={[8, 2.6, 16, 32]} />
              <meshStandardMaterial color="#c9ccd2" metalness={1} roughness={0.25} />
            </mesh>
            <group ref={phoneTurn} position={[0, -14, 0]}>
              <group position={[0, -d.ph / 2, 0]}>
                <Phone d={d} />
                <group ref={screenGroup} position={[0, 0, d.t / 2 + 0.4]}>
                  <mesh ref={holeRef} geometry={holeGeo} material={holeMat} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </>
  );
}


/* ---------------------------------------------------------------- parts */

function Strap({ length, width, color, tag }: { length: number; width: number; color: string; tag: string }) {
  return (
    <mesh position={[0, -length / 2, 0]} userData={{ hit: tag }}>
      <boxGeometry args={[width, length, 1.6]} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

/** Lanyard hook from the reference: a metal loop over a black plastic hook that drops into the slot. */
function Clip({ w }: { w: number }) {
  return (
    <group>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, -5, 0]} userData={{ hit: "pass:strap" }}>
        <torusGeometry args={[6, 1.8, 14, 28]} />
        <meshStandardMaterial color="#c9ccd2" metalness={1} roughness={0.22} />
      </mesh>
      <RoundedBox args={[w * 0.11, 20, 5]} radius={2.2} smoothness={4} position={[0, -18, 0]} userData={{ hit: "pass:strap" }}>
        <meshPhysicalMaterial color="#0d0e10" roughness={0.35} clearcoat={1} clearcoatRoughness={0.15} />
      </RoundedBox>
    </group>
  );
}

const flutterShapes = (() => {
  const mk = (pts: [number, number][]) => {
    const sh = new THREE.Shape();
    sh.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([x, y]) => sh.lineTo(x, y));
    return sh;
  };
  // Flutter logo on a 24 unit grid, y up.
  return {
    light: [
      mk([
        [14.3, 23],
        [3, 11.7],
        [6.5, 8.2],
        [21.3, 23],
      ]),
      mk([
        [14.3, 12.7],
        [8.2, 6.6],
        [11.7, 3],
        [17.8, 9.2],
        [21.3, 12.7],
      ]),
    ],
    dark: [
      mk([
        [11.7, 3],
        [15.2, 6.5],
        [11.7, 10],
        [8.2, 6.5],
      ]),
    ],
  };
})();

function FlutterLogo({ size }: { size: number }) {
  const k = size / 24;
  const geoL = useMemo(() => new THREE.ExtrudeGeometry(flutterShapes.light, { depth: 0.8, bevelEnabled: false }), []);
  const geoD = useMemo(() => new THREE.ExtrudeGeometry(flutterShapes.dark, { depth: 0.8, bevelEnabled: false }), []);
  return (
    <group scale={[k, k, 1]} position={[-12 * k, -13 * k, 0]}>
      <mesh geometry={geoL}>
        <meshStandardMaterial color="#cfd3da" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh geometry={geoD}>
        <meshStandardMaterial color="#8e949e" metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Lens({ r }: { r: number }) {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[r, r, 2.4, 40]} />
        <meshStandardMaterial color="#9a9fa8" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[r * 0.78, r * 0.82, 0.6, 40]} />
        <meshStandardMaterial color="#0b0c0f" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.85, 0]}>
        <sphereGeometry args={[r * 0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
        <meshPhysicalMaterial color="#0d1a33" metalness={0.2} roughness={0.04} clearcoat={1} clearcoatRoughness={0} />
      </mesh>
    </group>
  );
}

function Flash({ r }: { r: number }) {
  return (
    <mesh rotation={[0, Math.PI, 0]}>
      <circleGeometry args={[r, 24]} />
      <meshStandardMaterial color="#fff3c4" emissive="#ffe9a3" emissiveIntensity={0.6} />
    </mesh>
  );
}

/** One body, three devices: Pixel 8 (punch hole, camera bar), iPhone 15 (Dynamic Island, square module), tablet. */
function Phone({ d }: { d: Dims }) {
  const { pw, ph, t, r, device } = d;
  const bevel = t * 0.32;
  const body = useMemo(() => slab(pw, ph, t, r, bevel), [pw, ph, t, r, bevel]);
  const bezel = useMemo(
    () => new THREE.ShapeGeometry(roundedRect(pw - bevel * 2.4, ph - bevel * 2.4, Math.max(2, r - bevel)), 20),
    [pw, ph, r, bevel],
  );
  const island = useMemo(() => new THREE.ShapeGeometry(roundedRect(pw * 0.3, pw * 0.088, pw * 0.044), 12), [pw]);
  const bump = pw * (device === "tablet" ? 0.018 : 0.028);
  const bar = useMemo(() => slab(pw * 0.84, ph * 0.13, bump, pw * 0.075, bump * 0.35), [pw, ph, bump]);
  const sq = pw * 0.44;
  const square = useMemo(() => slab(sq, sq, bump, pw * 0.11, bump * 0.35), [sq, bump, pw]);
  const lensR = pw * (device === "tablet" ? 0.05 : 0.085);
  const back = -t / 2;
  const bezelSize = (pw - d.sw) / 2;
  return (
    <group userData={{ hit: "phone:body" }}>
      {/* invisible grab margin: the screen fills the front, so the frame alone is too thin to grab */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[pw + 44, ph + 36, t]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
      {/* body: glass caps + brushed metal frame (ExtrudeGeometry groups: 0 caps, 1 sides) */}
      <mesh geometry={body}>
        <meshPhysicalMaterial attach="material-0" color="#262a31" metalness={0.45} roughness={0.2} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={1.6} />
        <meshStandardMaterial attach="material-1" color={device === "iphone" ? "#7a7f88" : "#5a5e66"} metalness={1} roughness={0.32} />
      </mesh>
      {/* black bezel under the live screen */}
      <mesh position={[0, 0, t / 2 + 0.3]} geometry={bezel}>
        <meshBasicMaterial color="#050506" />
      </mesh>
      {/* front camera, drawn over the screen */}
      {device === "iphone" ? (
        <mesh geometry={island} position={[0, ph / 2 - pw * 0.1, t / 2 + 1.2]}>
          <meshBasicMaterial color="#000" />
        </mesh>
      ) : (
        <mesh position={[0, device === "tablet" ? ph / 2 - bezelSize / 2 : ph / 2 - pw * 0.105, t / 2 + 1.2]}>
          <circleGeometry args={[device === "tablet" ? bezelSize * 0.28 : pw * 0.033, 32]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      )}
      {/* side buttons */}
      <RoundedBox args={[2.4, ph * (device === "tablet" ? 0.08 : 0.14), t * 0.45]} radius={1} position={[pw / 2 + 0.6, ph * 0.22, 0]}>
        <meshStandardMaterial color="#6b6f78" metalness={1} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[2.4, ph * 0.07, t * 0.45]} radius={1} position={[pw / 2 + 0.6, ph * 0.04, 0]}>
        <meshStandardMaterial color="#6b6f78" metalness={1} roughness={0.3} />
      </RoundedBox>
      {/* USB-C */}
      <RoundedBox args={[pw * 0.11, 1.4, t * 0.32]} radius={0.6} position={[0, -ph / 2 + 0.2, 0]}>
        <meshStandardMaterial color="#060607" />
      </RoundedBox>

      {/* back cameras */}
      {device === "pixel" && (
        <group position={[0, ph / 2 - ph * 0.065 - ph * 0.035, back - bump / 2]}>
          <mesh geometry={bar}>
            <meshPhysicalMaterial color="#1b1d22" metalness={0.6} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />
          </mesh>
          {[-0.24, 0.02].map((fx) => (
            <group key={fx} position={[fx * pw * 0.84, 0, -bump / 2]}>
              <Lens r={lensR} />
            </group>
          ))}
          <group position={[pw * 0.84 * 0.32, 0, -bump / 2 - 0.4]}>
            <Flash r={pw * 0.028} />
          </group>
        </group>
      )}
      {device === "iphone" && (
        // seen from the back, the module sits top-left: +x here because the back faces -z
        <group position={[pw / 2 - pw * 0.07 - sq / 2, ph / 2 - pw * 0.07 - sq / 2, back - bump / 2]}>
          <mesh geometry={square}>
            <meshPhysicalMaterial color="#2a2d33" metalness={0.5} roughness={0.25} clearcoat={1} clearcoatRoughness={0.08} />
          </mesh>
          {[
            [0.22, 0.22],
            [0.22, -0.22],
            [-0.22, 0],
          ].map(([fx, fy]) => (
            <group key={`${fx}${fy}`} position={[fx * sq, fy * sq, -bump / 2]}>
              <Lens r={lensR * 0.92} />
            </group>
          ))}
          <group position={[-0.24 * sq, 0.27 * sq, -bump / 2 - 0.4]}>
            <Flash r={pw * 0.026} />
          </group>
        </group>
      )}
      {device === "tablet" && (
        <group position={[pw / 2 - pw * 0.08, ph / 2 - pw * 0.08, back - 0.4]}>
          <Lens r={lensR} />
        </group>
      )}
      {/* back logo */}
      <group position={[0, -ph * 0.02, back - 0.2]} rotation={[0, Math.PI, 0]}>
        <FlutterLogo size={pw * (device === "tablet" ? 0.16 : 0.24)} />
        <Text font={FONT} fontSize={pw * (device === "tablet" ? 0.032 : 0.048)} letterSpacing={0.12} color="#b8bdc6" position={[0, -pw * (device === "tablet" ? 0.13 : 0.2), 0]} anchorX="center">
          BUILT WITH FLUTTER
        </Text>
      </group>
    </group>
  );
}

function Barcode({ w, h }: { w: number; h: number }) {
  const bars = useMemo(() => {
    let seed = 13;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const out: { x: number; bw: number }[] = [];
    let x = 0;
    while (x < w) {
      const bw = 0.8 + rnd() * 2.2;
      out.push({ x: x + bw / 2, bw });
      x += bw + 0.8 + rnd() * 1.6;
    }
    return out;
  }, [w]);
  return (
    <group position={[-w / 2, 0, 0]}>
      {bars.map((b, i) => (
        <mesh key={i} position={[b.x, 0, 0]}>
          <planeGeometry args={[b.bw, h]} />
          <meshBasicMaterial color="#e9e9ea" />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The holder copies the reference "Digital Pass": smoky hard plastic, thick border, an oval slot
 * in the top band, a clear window. The insert is the work ID: front = who and where, back = impact.
 */
function Pass({ w, h, job }: { w: number; h: number; job: number }) {
  const j = JOBS[job] ?? JOBS[0];
  const depth = 6;
  const side = w * 0.055; // border on the sides and bottom
  const topBand = h * 0.13; // deeper band at the top that holds the slot
  const ww = w - side * 2; // window
  const wh = h - side - topBand;
  const wy = (side - topBand) / 2; // window centre (y)
  const slotW = w * 0.24;
  const slotH = topBand * 0.24;
  const slotY = h / 2 - topBand * 0.42;

  const frame = useMemo(() => {
    const outer = roundedRect(w, h, w * 0.06);
    const win = roundedRect(ww, wh, w * 0.035);
    // Holes must wind opposite to the outline, or the extrude fills them in.
    const winPath = new THREE.Path(win.getPoints(24).reverse().map((v) => new THREE.Vector2(v.x, v.y + wy)));
    const slot = roundedRect(slotW, slotH, slotH / 2);
    const slotPath = new THREE.Path(slot.getPoints(16).reverse().map((v) => new THREE.Vector2(v.x, v.y + slotY)));
    outer.holes.push(winPath, slotPath);
    const g = new THREE.ExtrudeGeometry(outer, {
      depth: depth - 1.6,
      bevelEnabled: true,
      bevelThickness: 0.8,
      bevelSize: 0.8,
      bevelSegments: 3,
      curveSegments: 20,
    });
    g.center();
    return g;
  }, [w, h, ww, wh, wy, slotW, slotH, slotY]);
  const windowGeo = useMemo(() => new THREE.ShapeGeometry(roundedRect(ww + 2, wh + 2, w * 0.035), 12), [ww, wh, w]);
  const iw = ww - w * 0.02;
  const ih = wh - w * 0.02;
  const insertGeo = useMemo(() => new THREE.ShapeGeometry(roundedRect(iw, ih, w * 0.025), 12), [iw, ih, w]);
  const rimGeo = useMemo(() => new THREE.ShapeGeometry(roundedRect(iw + 3, ih + 3, w * 0.028), 12), [iw, ih, w]);
  const f = w / 200; // type scale
  if (!j) return null;
  const color = new THREE.Color(j.color);

  return (
    <group userData={{ hit: "pass:body" }}>
      {/* smoky plastic frame with window and slot cut out */}
      <mesh geometry={frame}>
        <meshPhysicalMaterial color="#17181b" metalness={0.15} roughness={0.32} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      {/* clear windows, front and back: only glare */}
      {[1, -1].map((sd) => (
        <mesh key={sd} geometry={windowGeo} renderOrder={2} position={[0, wy, sd * (depth / 2 - 0.4)]} rotation={[0, sd < 0 ? Math.PI : 0, 0]}>
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.04} roughness={0.2} clearcoat={0.4} clearcoatRoughness={0.3} depthWrite={false} />
        </mesh>
      ))}

      {/* front insert: who and where */}
      <group position={[0, wy, 0.6]}>
        <mesh geometry={rimGeo} position={[0, 0, -0.1]}>
          <meshStandardMaterial color="#d5dbe2" roughness={0.6} />
        </mesh>
        <mesh geometry={insertGeo}>
          <meshBasicMaterial color={color.clone().multiplyScalar(0.62)} />
        </mesh>
        <mesh position={[0, ih * 0.18, 0.25]}>
          <planeGeometry args={[iw, ih * 0.64]} />
          <meshBasicMaterial color={color.clone().multiplyScalar(0.7)} />
        </mesh>
        <Text font={FONT} fontSize={17 * f} color="#ffffff" anchorX="left" anchorY="top" position={[-iw / 2 + 12 * f, ih / 2 - 12 * f, 0.7]}>
          {j.company}
        </Text>
        <Text font={FONT} fontSize={8 * f} letterSpacing={0.14} color="#ffffff" fillOpacity={0.8} anchorX="right" anchorY="top" position={[iw / 2 - 12 * f, ih / 2 - 16 * f, 0.7]}>
          {j.current ? "EMPLOYEE" : "ALUMNI"}
        </Text>
        <Text font={FONT} fontSize={74 * f} letterSpacing={-0.08} color="#ffffff" fillOpacity={0.93} anchorX="center" anchorY="middle" position={[0, ih * 0.1, 0.7]}>
          YN
        </Text>
        {/* name strip */}
        <mesh position={[0, -ih / 2 + ih * 0.15, 0.5]}>
          <planeGeometry args={[iw, ih * 0.3]} />
          <meshBasicMaterial color="#08080a" />
        </mesh>
        <Text font={FONT} fontSize={14 * f} color="#ffffff" anchorX="left" anchorY="top" position={[-iw / 2 + 12 * f, -ih / 2 + ih * 0.27, 0.9]}>
          Yash Nautiyal
        </Text>
        <Text font={FONT_REG} fontSize={10 * f} color="#ffffff" fillOpacity={0.73} anchorX="left" anchorY="top" position={[-iw / 2 + 12 * f, -ih / 2 + ih * 0.27 - 19 * f, 0.9]}>
          {j.title}
        </Text>
        <Text font={FONT_REG} fontSize={9 * f} color="#ffffff" fillOpacity={0.53} anchorX="left" anchorY="top" position={[-iw / 2 + 12 * f, -ih / 2 + ih * 0.27 - 33 * f, 0.9]}>
          {j.span}
        </Text>
        <group position={[iw / 2 - 30 * f, -ih / 2 + ih * 0.15, 0.9]}>
          <Barcode w={38 * f} h={ih * 0.15} />
        </group>
      </group>

      {/* back insert: impact */}
      <group position={[0, wy, -0.6]} rotation={[0, Math.PI, 0]}>
        <mesh geometry={rimGeo} position={[0, 0, -0.1]}>
          <meshStandardMaterial color="#d5dbe2" roughness={0.6} />
        </mesh>
        <mesh geometry={insertGeo}>
          <meshBasicMaterial color={color.clone().multiplyScalar(0.3)} />
        </mesh>
        <Text font={FONT} fontSize={9 * f} letterSpacing={0.14} color="#ffffff" fillOpacity={0.6} anchorX="left" anchorY="top" position={[-iw / 2 + 14 * f, ih / 2 - 14 * f, 0.3]}>
          {`${j.short.toUpperCase()} · IMPACT`}
        </Text>
        {j.stats.map((st, i) => (
          <group key={st.label} position={[-iw / 2 + 14 * f, ih / 2 - 32 * f - i * 46 * f, 0.3]}>
            <Text font={FONT} fontSize={26 * f} letterSpacing={-0.03} color={color.clone().lerp(new THREE.Color("#ffffff"), 0.5)} anchorX="left" anchorY="top">
              {st.value}
            </Text>
            <Text font={FONT_REG} fontSize={9 * f} color="#ffffff" fillOpacity={0.73} anchorX="left" anchorY="top" position={[0, -27 * f, 0]}>
              {st.label}
            </Text>
          </group>
        ))}
        <Text
          font={FONT_REG}
          fontSize={8.5 * f}
          color="#ffffff"
          fillOpacity={0.67}
          anchorX="left"
          anchorY="bottom"
          maxWidth={iw - 28 * f}
          lineHeight={1.5}
          position={[-iw / 2 + 14 * f, -ih / 2 + 12 * f, 0.3]}
        >
          {/* the back has room for one line pair; the full list is on the phone's Career screen */}
          {j.skills.slice(0, 4).map((k) => SKILLS[k].label).join("  ·  ")}
        </Text>
      </group>
    </group>
  );
}
