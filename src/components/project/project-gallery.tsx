"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PhoneFrame } from "./project-gallery-phone-frame";
import { GalleryZoomDialog } from "./project-gallery-zoom-dialog";
import s from "./case-study.module.css";

interface SlideShowProps {
  images: string[];
  /**
   * "mobile" / "mobile-multi" – app screenshots, shown in a phone frame
   * "playstore" – store graphics (they already contain a device), plain portrait tiles
   * "web" – wide screenshots
   */
  variant?: "web" | "mobile" | "mobile-multi" | "playstore";
}

/** A scroll-snap strip styled like the home's phone stage. Click a shot to zoom. */
const SlideShow = ({ images, variant = "web" }: SlideShowProps) => {
  const [zoom, setZoom] = useState<number | null>(null);
  const [edge, setEdge] = useState({ start: true, end: true });
  const track = useRef<HTMLDivElement>(null);
  const phone = variant === "mobile" || variant === "mobile-multi";
  const n = images.length;

  const update = () => {
    const t = track.current;
    if (!t) return;
    setEdge({ start: t.scrollLeft < 4, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 });
  };
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    update();
    // The track and its shots: either resizing can change whether the row overflows.
    const ro = new ResizeObserver(update);
    [t, ...t.children].forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const page = (dir: number) => {
    const t = track.current;
    if (!t) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy({ left: dir * t.clientWidth * 0.8, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <figure className={s.gallery}>
      <div
        ref={track}
        className={s.track}
        onScroll={update}
        tabIndex={edge.start && edge.end ? undefined : 0}
        role="group"
        aria-label={`${n} screenshot${n > 1 ? "s" : ""}`}
      >
        {images.map((src, i) => {
          const alt = `Screenshot ${i + 1} of ${n}`;
          return (
            <button
              key={src + i}
              type="button"
              className={phone ? s.shot : `${s.shot} ${s.tile} ${variant === "web" ? s.tileWide : ""}`}
              onClick={() => setZoom(i)}
              aria-label={`Zoom ${alt.toLowerCase()}`}
            >
              {phone ? <PhoneFrame src={src} alt={alt} /> : <Image src={src} alt={alt} fill sizes="(max-width: 640px) 46vw, 230px" />}
            </button>
          );
        })}
      </div>
      <figcaption className={s.galleryBar}>
        <span className={s.mono}>
          {n} screen{n > 1 ? "s" : ""} · tap to zoom
        </span>
        {!(edge.start && edge.end) && (
          <>
            <button type="button" className={s.navBtn} onClick={() => page(-1)} disabled={edge.start} aria-label="Scroll screenshots left">
              <ChevronLeft size={16} aria-hidden />
            </button>
            <button type="button" className={s.navBtn} onClick={() => page(1)} disabled={edge.end} aria-label="Scroll screenshots right">
              <ChevronRight size={16} aria-hidden />
            </button>
          </>
        )}
      </figcaption>
      <GalleryZoomDialog images={images} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} />
    </figure>
  );
};

export default SlideShow;
