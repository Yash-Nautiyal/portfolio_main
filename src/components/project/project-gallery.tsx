"use client";

import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { PhoneFrame } from "./project-gallery-phone-frame";
import { GalleryZoomDialog } from "./project-gallery-zoom-dialog";

import "@splidejs/react-splide/css";

interface SlideShowProps {
  images: string[];
  /**
   * "web"    – original wide landscape layout (default)
   * "mobile" – portrait screenshots shown inside a phone frame mockup
   * "mobile-multi" – 2–3 phone frames visible at once (great for browsing many screens)
   */
  variant?: "web" | "mobile" | "mobile-multi" | "playstore";
}

// ─── SlideShow ────────────────────────────────────────────────────────────────
const SlideShow = ({ images, variant = "web" }: SlideShowProps) => {
  const [selectedImage, setSelectedImage] = useState("");

  const isMobile = variant === "mobile" || variant === "mobile-multi";
  const maxPerPage = variant === "mobile-multi" ? 3 : 1;
  const perPage = Math.min(images.length, maxPerPage);

  return (
    <>
      {/* ── Mobile variants ─────────────────────────────────────── */}
      {isMobile ? (
        <div
          className="my-6 w-full max-w-full overflow-hidden"
          style={{ contain: "layout" }}
        >
          <Splide
            options={{
              autoplay: false,
              perPage,
              perMove: 1,
              rewind: true,
              gap: "0.75rem",
              padding: { left: "3.5rem", right: "3.5rem" },
              trimSpace: true,
              fixedWidth: false,
              width: "100%",
              breakpoints: {
                640: {
                  perPage: 1,
                  gap: "0.5rem",
                  padding: { left: "2.5rem", right: "2.5rem" },
                },
                1024: {
                  perPage: Math.min(images.length, variant === "mobile-multi" ? 2 : 1),
                },
              },
            }}
            hasTrack={false}
            className="w-full max-w-full"
            style={{ maxWidth: "100%" }}
          >
            <SplideTrack>
              {images.map((image, idx) => (
                <SplideSlide
                  key={idx}
                  className="flex items-center justify-center py-6 overflow-hidden"
                >
                  <PhoneFrame src={image} onClick={() => setSelectedImage(image)} />
                </SplideSlide>
              ))}
            </SplideTrack>

            {/* Progress bar */}
            <div className="splide__progress mt-3">
              <div className="splide__progress__bar" />
            </div>
          </Splide>
        </div>
      ) : variant === "playstore" ? (
        /* ── Play Store style – portrait cards, 2.5 visible, full image shown ── */
        <div className="my-6 w-full overflow-hidden">
          <Splide
            options={{
              autoplay: false,
              perPage: 3,
              perMove: 1,
              rewind: true,
              gap: "0.6rem",
              // Peek half of a third card to signal more content
              padding: { left: "0", right: "12%" },
              trimSpace: false,
              width: "100%",
              breakpoints: {
                640: {
                  perPage: 1,
                  padding: { left: "0", right: "25%" },
                  gap: "0.5rem",
                },
              },
            }}
            hasTrack={false}
            className="w-full"
          >
            <SplideTrack>
              {images.map((image, idx) => (
                <SplideSlide key={idx} className="py-2">
                  <motion.button
                    onClick={() => setSelectedImage(image)}
                    className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-md"
                    style={{ aspectRatio: "9/16" }}
                    initial="idle"
                    whileHover="hover"
                  >
                    <Image
                      src={image}
                      alt="app screenshot"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 75vw, 45vw"
                    />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white/90 backdrop-blur-[2px] rounded-2xl"
                      variants={{ idle: { opacity: 0 }, hover: { opacity: 1 } }}
                      transition={{ duration: 0.2 }}
                    >
                      Click to zoom
                    </motion.div>
                  </motion.button>
                </SplideSlide>
              ))}
            </SplideTrack>

            <div className="splide__progress mt-3">
              <div className="splide__progress__bar" />
            </div>
          </Splide>
        </div>
      ) : (
        /* ── Web / landscape variant (original) ──────────────── */
        <Splide
          options={{
            autoplay: "true",
            perPage: 1,
            start: 0,
            rewind: true,
            padding: { left: "3rem", right: "3rem" },
            gap: "1rem",
            breakpoints: {
              768: {
                padding: { left: "0.5rem", right: "0.5rem" },
                gap: "0.5rem",
              },
            },
          }}
          hasTrack={false}
        >
          <SplideTrack>
            {images.map((image, idx) => (
              <SplideSlide key={idx} className="flex items-center">
                <motion.button
                  className="relative block w-full cursor-zoom-in overflow-hidden rounded-lg bg-black/5"
                  onClick={() => setSelectedImage(image)}
                  initial="idle"
                  whileHover="hover"
                >
                  <Image
                    src={image}
                    alt="screenshot"
                    width={1000}
                    height={1000}
                    className="h-[62svh] w-full object-contain sm:h-[70svh]"
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 text-sm text-white/90 backdrop-blur-[2px]"
                    variants={{ idle: { opacity: 0 }, hover: { opacity: 1 } }}
                    transition={{ duration: 0.2 }}
                  >
                    Click to zoom
                  </motion.div>
                </motion.button>
              </SplideSlide>
            ))}
          </SplideTrack>
          <div className="splide__progress">
            <div className="splide__progress__bar" />
          </div>
        </Splide>
      )}

      <GalleryZoomDialog
        selectedImage={selectedImage}
        onClose={() => setSelectedImage("")}
      />
    </>
  );
};

export default SlideShow;
