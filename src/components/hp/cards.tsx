import { FaLinkedinIn } from "react-icons/fa";
import { SiFlutter, SiGithub, SiGmail, SiGoogleplay } from "react-icons/si";
import { FileText, LayoutGrid } from "lucide-react";
import { config } from "@/data/config";
import { SkillNames } from "@/data/experience";
import projects from "@/data/projects";
import s from "./home.module.css";
import { BuildRows, JobRows } from "./build-rows";
import { CtaButtons, HexLink, SkillChips } from "./card-controls";
import type { Screen } from "./phone-context";

export function IntroCard() {
  return (
    <section data-widget="Column" className={`${s.card} ${s.intro}`} style={{ "--i": 0 } as React.CSSProperties}>
      <span className={s.handle}>@yash-nautiyal</span>
      <h1 className={s.hello}>
        Hello<span className={s.wave}>!</span>
        <br />
        I&apos;m Yash
      </h1>
      <p className={s.bio}>
        <b>Flutter Developer</b> building production-grade mobile products with measurable impact. Apps
        shipped end to end, from Supabase and Firebase backends to the Play Store.
      </p>
      <SkillChips />
    </section>
  );
}

export function CtaCard() {
  return (
    <section data-widget="Row" className={`${s.card} ${s.cta}`} style={{ "--i": 2 } as React.CSSProperties}>
      <CtaButtons resume={config.resume} />
    </section>
  );
}

const HEX: { x: number; y: number; label: string; href?: string; icon: React.ReactNode; bg: string; centre?: boolean; screen?: Screen }[] = [
  { x: 1, y: 0, label: "GitHub", href: config.social.github.link, screen: { name: "github" }, icon: <SiGithub />, bg: "#24292f" },
  { x: 3, y: 0, label: "LinkedIn", href: config.social.linkedin.link, screen: { name: "linkedin" }, icon: <FaLinkedinIn />, bg: "#0a66c2" },
  { x: 0, y: 1, label: "Email", href: config.social.gmail.link, screen: { name: "compose" }, icon: <SiGmail />, bg: "#ea4335" },
  { x: 2, y: 1, label: "Flutter", href: "/about", screen: { name: "skill", id: SkillNames.FLUTTER }, icon: <SiFlutter />, bg: "#0b2540", centre: true },
  {
    x: 4,
    y: 1,
    label: "Play Store",
    href: projects.find((p) => p.live)?.live,
    screen: { name: "store" },
    icon: <SiGoogleplay />,
    bg: "#01875f",
  },
  { x: 1, y: 2, label: "Resume", href: config.resume, screen: { name: "cv" }, icon: <FileText />, bg: "#0d3550" },
  { x: 3, y: 2, label: "All builds", href: "/projects", screen: { name: "home" }, icon: <LayoutGrid />, bg: "#2b2b2b" },
];

export function Honeycomb() {
  return (
    <section data-widget="Wrap" className={`${s.card} ${s.honeyCard}`} style={{ "--i": 1 } as React.CSSProperties}>
      <div className={s.honey}>
        {HEX.map((h) => {
          const style = { "--x": h.x, "--y": h.y } as React.CSSProperties;
          const inner = (
            <span className={s.hexInner}>
              <span className={s.appIcon} style={{ background: h.bg }} data-fly>
                {h.icon}
              </span>
              {!h.centre && <em>{h.label}</em>}
            </span>
          );
          return (
            <HexLink key={h.label} href={h.href ?? "/"} screen={h.screen} label={h.label} style={style} centre={h.centre}>
              {inner}
            </HexLink>
          );
        })}
      </div>
    </section>
  );
}

export function BuildsCard() {
  return (
    <section data-widget="ListView" className={`${s.card} ${s.builds}`} style={{ "--i": 3 } as React.CSSProperties}>
      <h2>Latest builds</h2>
      <ul>
        <BuildRows />
      </ul>
      <h2 className={s.careerHead}>Career</h2>
      <ul>
        <JobRows />
      </ul>
    </section>
  );
}
