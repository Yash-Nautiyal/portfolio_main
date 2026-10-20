import Image from "next/image";
import type { Build } from "@/data/builds";
import s from "./home.module.css";

/** A build's (or company's) icon: its logo on its tile colour. The tile's size and shape come from `className`. */
export function AppIcon({
  build,
  className,
  sizes = "96px",
}: {
  build: Pick<Build, "logo" | "logoBg" | "logoScale">;
  className?: string;
  sizes?: string;
}) {
  return (
    <span
      className={`${s.appLogo} ${className ?? ""}`}
      style={{ background: build.logoBg, "--logo-scale": build.logoScale ?? 1 } as React.CSSProperties}
    >
      <Image src={build.logo} alt="" fill sizes={sizes} />
    </span>
  );
}
