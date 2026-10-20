import {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ElementType,
    type ReactNode,
    type Ref,
  } from 'react';
  
  // ─── PROPS ─────────────────────────────────────────────────────
  
  interface LiquidGlassSurfaceProps {
    active: boolean;
    scrollY?: number;
    children: ReactNode;
    className?: string;
    as?: ElementType;
    bezel?: number;
    strength?: number;
    blur?: number;
    chroma?: number;
  }
  
  // ─── DISPLACEMENT MAP ────────────────────────────────────────────
  
  function buildDisplacementMap(w: number, h: number, radius: number, bezel: number): string {
    const c = document.createElement('canvas');
    c.width = Math.max(2, Math.round(w));
    c.height = Math.max(2, Math.round(h));
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    const img = ctx.createImageData(c.width, c.height);
    const d = img.data;
    const cx = c.width / 2;
    const cy = c.height / 2;
    const hx = c.width / 2;
    const hy = c.height / 2;
    const r = Math.min(radius, hx, hy);
  
    const sdf = (x: number, y: number) => {
      const qx = Math.abs(x - cx) - (hx - r);
      const qy = Math.abs(y - cy) - (hy - r);
      const ax = Math.max(qx, 0);
      const ay = Math.max(qy, 0);
      return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
    };
  
    const MAG = 0.14;
    const maxR = Math.max(hx, hy);
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        const px = x + 0.5;
        const py = y + 0.5;
        const dist = sdf(px, py);
        let mx = 0;
        let my = 0;
        if (dist < 0) {
          const t = Math.min(-dist / bezel, 1);
          const s = t * t * (3 - 2 * t);
          const edge = 1 - s;
          if (edge > 0.002) {
            const e = 1;
            const gx = sdf(px + e, py) - sdf(px - e, py);
            const gy = sdf(px, py + e) - sdf(px, py - e);
            const len = Math.hypot(gx, gy) || 1;
            mx = -(gx / len) * edge;
            my = -(gy / len) * edge;
          }
          mx += ((cx - px) / maxR) * MAG * s;
          my += ((cy - py) / maxR) * MAG * s;
          const ml = Math.hypot(mx, my);
          if (ml > 1) {
            mx /= ml;
            my /= ml;
          }
        }
        d[i] = 128 + mx * 127;
        d[i + 1] = 128 + my * 127;
        d[i + 2] = 128;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL();
  }
  
  const supportsSvgBackdrop = () =>
    typeof CSS !== 'undefined' &&
    (CSS.supports('backdrop-filter', 'url(#f)') ||
      CSS.supports('-webkit-backdrop-filter', 'url(#f)'));
  
  const prefersReducedMotion = () =>
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // ─── COMPONENT ─────────────────────────────────────────────────
  
  export function LiquidGlassSurface({
    active,
    scrollY = 0,
    children,
    className = '',
    as: Component = 'div',
    bezel = 8,
    strength = 23,
    blur = 1,
    chroma = 2,
  }: LiquidGlassSurfaceProps) {
    const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const filterId = `lg-${rawId}`;
    const hostRef = useRef<HTMLElement | null>(null);
    const redRef = useRef<SVGFEDisplacementMapElement | null>(null);
    const grnRef = useRef<SVGFEDisplacementMapElement | null>(null);
    const bluRef = useRef<SVGFEDisplacementMapElement | null>(null);
    const rafRef = useRef(0);
  
    const [refractive] = useState(supportsSvgBackdrop);
    const [mapUrl, setMapUrl] = useState('');
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [popping, setPopping] = useState(false);
    const wasActive = useRef(active);
  
    const setScales = useCallback(
      (s: number) => {
        const k = chroma / 100;
        redRef.current?.setAttribute('scale', String(s * (1 + k)));
        grnRef.current?.setAttribute('scale', String(s));
        bluRef.current?.setAttribute('scale', String(s * (1 - k)));
      },
      [chroma]
    );
  
    useLayoutEffect(() => {
      if (!refractive || !active) return;
      const el = hostRef.current;
      if (!el) return;
      let timer = 0;
      const measure = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        const radius = parseFloat(getComputedStyle(el).borderRadius) || height / 2;
        setSize({ w: width, h: height });
        setMapUrl(buildDisplacementMap(width, height, radius, Math.min(bezel, height / 2)));
      };
      measure();
      const ro = new ResizeObserver(() => {
        window.clearTimeout(timer);
        timer = window.setTimeout(measure, 80);
      });
      ro.observe(el);
      return () => {
        ro.disconnect();
        window.clearTimeout(timer);
      };
    }, [refractive, active, bezel]);
  
    useEffect(() => {
      if (refractive) setScales(strength);
    }, [refractive, strength, mapUrl, setScales]);
  
    useEffect(() => {
      if (active && !wasActive.current) {
        setPopping(true);
        const popTimer = window.setTimeout(() => setPopping(false), 700);
        if (refractive && !prefersReducedMotion()) {
          const t0 = performance.now();
          const dur = 650;
          const tick = (now: number) => {
            const t = Math.min((now - t0) / dur, 1);
            const c1 = 1.4;
            const c3 = c1 + 1;
            const e = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            setScales(strength * (1.8 - 0.8 * e));
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
            else setScales(strength);
          };
          rafRef.current = requestAnimationFrame(tick);
        }
        wasActive.current = active;
        return () => {
          window.clearTimeout(popTimer);
          cancelAnimationFrame(rafRef.current);
        };
      }
      wasActive.current = active;
      return undefined;
    }, [active, refractive, strength, setScales]);
  
    const style = {
      '--scroll-y': scrollY,
      ...(refractive && active && mapUrl
        ? { backdropFilter: `url(#${filterId})`, WebkitBackdropFilter: `url(#${filterId})` }
        : {}),
    } as CSSProperties;
  
    const shellClass = active ? (refractive ? 'lg-shell lg-refract' : 'lg-shell lg-fallback') : '';
  
    // R3F adds 3D tags to JSX.IntrinsicElements, which collapses ElementType props to never.
    const Tag = Component as 'div';
    return (
      <Tag
        ref={hostRef as Ref<HTMLDivElement>}
        className={`relative transition-all duration-slow ease-out ${shellClass} ${
          popping ? 'lg-pop' : ''
        } ${className}`.trim()}
        style={style}
      >
        {refractive && active && mapUrl && (
          <svg className="lg-defs" aria-hidden="true" focusable="false">
            <defs>
              <filter
                id={filterId}
                x="0"
                y="0"
                width="100%"
                height="100%"
                colorInterpolationFilters="sRGB"
                primitiveUnits="userSpaceOnUse"
              >
                <feImage
                  href={mapUrl}
                  x="0"
                  y="0"
                  width={size.w}
                  height={size.h}
                  preserveAspectRatio="none"
                  result="map"
                />
                <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="soft" />
                <feDisplacementMap
                  ref={redRef}
                  in="soft"
                  in2="map"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="dr"
                />
                <feColorMatrix
                  in="dr"
                  result="cr"
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                />
                <feDisplacementMap
                  ref={grnRef}
                  in="soft"
                  in2="map"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="dg"
                />
                <feColorMatrix
                  in="dg"
                  result="cg"
                  type="matrix"
                  values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                />
                <feDisplacementMap
                  ref={bluRef}
                  in="soft"
                  in2="map"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="db"
                />
                <feColorMatrix
                  in="db"
                  result="cb"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                />
                <feComposite
                  in="cr"
                  in2="cg"
                  operator="arithmetic"
                  k1="0"
                  k2="1"
                  k3="1"
                  k4="0"
                  result="rg"
                />
                <feComposite
                  in="rg"
                  in2="cb"
                  operator="arithmetic"
                  k1="0"
                  k2="1"
                  k3="1"
                  k4="0"
                  result="rgb"
                />
                <feColorMatrix in="rgb" type="saturate" values="1.35" result="sat" />
                <feGaussianBlur in="sat" stdDeviation="0.35" />
              </filter>
            </defs>
          </svg>
        )}
        {active && (
          <>
            <span className="lg-tint" aria-hidden="true" />
            <span className="lg-edge" aria-hidden="true" />
            <span className="lg-sheen" aria-hidden="true" />
          </>
        )}
        <div className="relative z-10 flex w-full items-center justify-between">{children}</div>
      </Tag>
    );
  }