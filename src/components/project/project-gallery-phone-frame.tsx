import Image from "next/image";
import s from "./case-study.module.css";

/** A CSS device in the hanging phone's proportions: bezel, punch-hole camera, side keys. */
export function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <span className={s.phone}>
      <span className={s.screen}>
        <Image src={src} alt={alt} fill sizes="190px" />
      </span>
    </span>
  );
}
