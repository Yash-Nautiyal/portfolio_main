"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function PhoneFrame({ src, onClick }: { src: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative block w-full cursor-zoom-in"
      style={{ maxWidth: "clamp(120px, 18vw, 190px)" }}
      whileHover="hover"
      initial="idle"
    >
      <div
        className="relative overflow-hidden rounded-2xl border-[6px] border-neutral-800 bg-neutral-900 shadow-2xl"
        style={{ aspectRatio: "9/19.5" }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <Image
            src={src}
            alt="app screenshot"
            fill
            className="object-cover object-top"
            sizes="220px"
          />
        </div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 text-sm text-white/90 backdrop-blur-[2px]"
          variants={{ idle: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.2 }}
        >
          Click to zoom
        </motion.div>
      </div>
      <div className="absolute right-[-8px] top-24 h-14 w-[5px] rounded-r-sm bg-neutral-700" />
      <div className="absolute left-[-8px] top-16 h-10 w-[5px] rounded-l-sm bg-neutral-700" />
      <div className="absolute left-[-8px] top-28 h-10 w-[5px] rounded-l-sm bg-neutral-700" />
    </motion.button>
  );
}
