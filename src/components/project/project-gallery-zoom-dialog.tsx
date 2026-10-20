"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import s from "./case-study.module.css";

/** Native modal <dialog>: focus trap, Escape and backdrop close come from the platform. Arrow keys page. */
export function GalleryZoomDialog({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: string[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const n = images.length;
  const step = (by: number) => index !== null && onIndex((index + by + n) % n);

  return (
    <dialog
      ref={ref}
      className={s.zoom}
      aria-label="Screenshot"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") step(-1);
        else if (e.key === "ArrowRight") step(1);
      }}
    >
      {open && (
        <div className={s.zoomBody} onClick={(e) => e.target === e.currentTarget && onClose()}>
          {/* Plain <img>: intrinsic size unknown and it must fit the viewport both ways. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.zoomImg} src={images[index]} alt={`Screenshot ${index + 1} of ${n}`} />
          <div className={s.zoomBar}>
            {n > 1 && (
              <button type="button" className={s.navBtn} onClick={() => step(-1)} aria-label="Previous screenshot">
                <ChevronLeft size={16} aria-hidden />
              </button>
            )}
            <span className={s.mono}>
              {index + 1} / {n}
            </span>
            {n > 1 && (
              <button type="button" className={s.navBtn} onClick={() => step(1)} aria-label="Next screenshot">
                <ChevronRight size={16} aria-hidden />
              </button>
            )}
            <button type="button" className={s.navBtn} onClick={onClose} aria-label="Close">
              <X size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
