"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Download, ExternalLink, GraduationCap, Mail, MapPin, Send } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import { config } from "@/data/config";
import { BUILDS } from "@/data/builds";
import { AppIcon } from "./app-icon";
import { JOBS } from "@/data/career";
import { EXPERIENCE, SKILLS, type SkillNames } from "@/data/experience";
import projects from "@/data/projects";
import s from "./home.module.css";
import { usePhone } from "./phone-context";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function TopBar({ title, tone = "light" }: { title: string; tone?: "light" | "dark" }) {
  const { go } = usePhone();
  return (
    <div className={s.topBar} data-tone={tone}>
      <button type="button" aria-label="Back to home screen" onClick={() => go({ name: "home" })}>
        <ArrowLeft aria-hidden />
      </button>
      <b>{title}</b>
    </div>
  );
}

export function SkillScreen({ id }: { id: SkillNames }) {
  const { run } = usePhone();
  const skill = SKILLS[id];
  const jobs = JOBS.filter((j) => j.skills.includes(id));
  const used = projects
    .filter((p) => [...p.skills.frontend, ...p.skills.backend].some((k) => k.title === skill.label))
    .map((p) => BUILDS.find((b) => b.id === p.id)!)
    .filter(Boolean);

  return (
    <div className={s.skillScreen} style={{ "--skill": skill.color } as React.CSSProperties}>
      <TopBar title="Skill" tone="dark" />
      <div className={s.skillHead}>
        <Image src={skill.icon} alt="" width={64} height={64} className={s.skillLogo} unoptimized />
        <b>{skill.label}</b>
        <p>{skill.shortDescription}</p>
      </div>
      <p className={s.skillLabel}>{used.length ? `Used in ${used.length} of my builds` : "Not in a listed build yet"}</p>
      <ul className={s.skillApps}>
        {used.map((b) => (
          <li key={b.id}>
            <button type="button" onClick={() => run(b.id)}>
              <AppIcon build={b} className={s.appSquircle} sizes="48px" />
              <span>{b.title}</span>
            </button>
          </li>
        ))}
      </ul>
      {jobs.length > 0 && (
        <p className={s.skillJob}>Used at work: {jobs.map((j) => j.company).join(", ")}</p>
      )}
    </div>
  );
}

export function ComposeScreen() {
  const { go, notify } = usePhone();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // Read the fields at submit time: always the current values.
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "");
    const email = String(f.get("email") ?? "");
    const message = String(f.get("message") ?? "");
    if (name.trim().length < 2) return setError("Add your name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Add a valid email so Yash can reply.");
    if (message.trim().length < 10) return setError("Write at least 10 characters.");
    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: unknown } | null;
        setError(typeof data?.error === "string" ? data.error : "Couldn't send. Try again.");
        return;
      }
      go({ name: "home" });
      notify({ title: "Message sent", body: "Yash will reply by email." });
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form className={s.compose} onSubmit={send} noValidate>
      <TopBar title="New message" />
      <div className={s.composeTo}>
        <span>To</span>
        <b>Yash Nautiyal</b>
      </div>
      <label className={s.field}>
        <span>Your name</span>
        <input name="name" autoComplete="name" placeholder="Priya Sharma" />
      </label>
      <label className={s.field}>
        <span>Your email</span>
        <input name="email" type="email" autoComplete="email" placeholder="priya@company.com" />
      </label>
      <label className={`${s.field} ${s.fieldGrow}`}>
        <span>Message</span>
        <textarea name="message" placeholder="We're hiring a Flutter developer…" />
      </label>
      {error && (
        <p className={s.formError} role="alert">
          {error}
        </p>
      )}
      <button type="submit" className={s.sendBtn} disabled={pending}>
        <Send aria-hidden /> {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

/** The CV as a document in a PDF viewer, built from the site's own data so it never drifts from it. */
export function CvScreen() {
  const a = config.about;
  const stack = (id: string) => {
    const p = projects.find((x) => x.id === id);
    return p ? [...p.skills.frontend, ...p.skills.backend].map((k) => k.title).slice(0, 4).join(", ") : "";
  };
  return (
    <div className={s.cvScreen}>
      <TopBar title="Resume.pdf" tone="dark" />
      <div className={s.cvScroll}>
        <article className={s.cvPage} aria-label="Resume">
          <h1>{config.author}</h1>
          <p className={s.cvContact}>
            <span>{a.location}</span>
            <a href={`mailto:${config.email}`}>{config.email}</a>
            <a href={config.social.linkedin.link} {...ext}>
              LinkedIn
            </a>
            <a href={config.social.github.link} {...ext}>
              GitHub
            </a>
          </p>

          <h2>Summary</h2>
          <p>{a.overview}</p>

          <h2>Experience</h2>
          {EXPERIENCE.map((e) => (
            <section key={e.id} className={s.cvItem}>
              <div className={s.cvRow}>
                <b>{e.title}</b>
                <span>
                  {e.startDate} – {e.endDate}
                </span>
              </div>
              <i className={s.cvSub}>{e.company}</i>
              <ul>
                {e.description.map((d) => (
                  <li key={d}>{mark(d, e.highlights)}</li>
                ))}
              </ul>
            </section>
          ))}

          <h2>Projects</h2>
          {BUILDS.map((b) => (
            <section key={b.id} className={s.cvItem}>
              <div className={s.cvRow}>
                <b>{b.title}</b>
                <span>{b.live ? "On Google Play" : "Open source"}</span>
              </div>
              <i className={s.cvSub}>{stack(b.id) || b.category}</i>
              <p>{b.tagline}</p>
            </section>
          ))}

          <h2>Technical skills</h2>
          <dl className={s.cvSkills}>
            <div>
              <dt>Languages</dt>
              <dd>{a.languages}</dd>
            </div>
            <div>
              <dt>State management</dt>
              <dd>{a.stateManagement}</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>{Object.values(SKILLS).map((k) => k.label).join(", ")}</dd>
            </div>
          </dl>

          <h2>Education</h2>
          <p>{a.education}</p>
        </article>
      </div>
      <div className={s.cvActions}>
        <a href={config.resume} {...ext}>
          <Download aria-hidden /> Download PDF
        </a>
      </div>
    </div>
  );
}

export function GithubScreen() {
  const user = config.social.github.link.replace(/\/$/, "").split("/").pop()!;
  const repos = BUILDS.filter((b) => b.github);
  return (
    <div className={s.ghScreen}>
      <TopBar title="GitHub" tone="dark" />
      <div className={s.ghHead}>
        <Image src={`https://github.com/${user}.png`} alt="" width={72} height={72} unoptimized className={s.ghAvatar} />
        <b>{config.author}</b>
        <span>@{user}</span>
      </div>
      <p className={s.ghLabel}>Repositories</p>
      <ul className={s.ghRepos}>
        {repos.map((b) => (
          <li key={b.id}>
            <a href={b.github} {...ext}>
              <SiGithub aria-hidden />
              <span>
                <b>{b.github!.split("/").pop()}</b>
                <small>{b.category}</small>
              </span>
              <ExternalLink aria-hidden className={s.extIcon} />
            </a>
          </li>
        ))}
      </ul>
      <a className={s.wideBtn} href={config.social.github.link} {...ext}>
        Open GitHub profile
      </a>
    </div>
  );
}

/** A LinkedIn-style profile, scrolled like the app: header card, then About, Experience, Education, Skills. */
export function LinkedinScreen() {
  const a = config.about;
  const job = JOBS[0];
  return (
    <div className={s.liScreen}>
      <TopBar title="LinkedIn" />
      <div className={s.liScroll}>
        <section className={`${s.liCard} ${s.liHead}`}>
          <div className={s.liBanner} aria-hidden />
          <span className={`${s.appSquircle} ${s.aboutIcon} ${s.liAvatar}`}>YN</span>
          <b className={s.liName}>{config.author}</b>
          <p className={s.liHeadline}>
            {job ? `${job.title} at ${job.company}` : a.role} · {a.stateManagement.split(", ")[0]} · Clean Architecture
          </p>
          <span className={s.liLoc}>
            <MapPin aria-hidden /> {a.location}, India
          </span>
          <div className={s.liBtns}>
            <a className={s.liBtn} href={config.social.linkedin.link} {...ext}>
              <FaLinkedinIn aria-hidden /> View profile
            </a>
            <a className={`${s.liBtn} ${s.liBtnAlt}`} href={`mailto:${config.email}`}>
              <Mail aria-hidden /> Message
            </a>
          </div>
        </section>

        <section className={s.liCard}>
          <h3>About</h3>
          <p className={s.liAbout}>{a.overview}</p>
        </section>

        <section className={s.liCard}>
          <h3>Experience</h3>
          {JOBS.map((j) => (
            <div key={j.id} className={s.liRow}>
              {j.logo ? (
                <AppIcon build={{ ...j, logo: j.logo }} className={`${s.liLogo} ${s.liLogoImg}`} sizes="32px" />
              ) : (
                <span className={s.liLogo} style={{ background: j.color }} aria-hidden>
                  {j.short}
                </span>
              )}
              <div>
                <b>{j.title}</b>
                <span>
                  {j.company} · {j.current ? "Full-time" : "Past"}
                </span>
                <small>{j.span}</small>
              </div>
            </div>
          ))}
        </section>

        <section className={s.liCard}>
          <h3>Education</h3>
          <div className={s.liRow}>
            <span className={`${s.liLogo} ${s.liEdu}`} aria-hidden>
              <GraduationCap />
            </span>
            <div>
              <b>{a.education.split(", ").slice(1).join(", ").replace(/\s*\(.*\)$/, "")}</b>
              <span>{a.education.split(", ")[0]}</span>
              <small>{a.education.match(/\(([^)]*)\)/)?.[1]}</small>
            </div>
          </div>
        </section>

        <section className={s.liCard}>
          <h3>Skills</h3>
          <ul className={s.liSkills}>
            {Object.values(SKILLS)
              .slice(0, 6)
              .map((k) => (
                <li key={k.label}>{k.label}</li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function StoreScreen() {
  const app = BUILDS.find((b) => b.live);
  if (!app) return null;
  return (
    <div className={s.storeScreen}>
      <TopBar title="Google Play" />
      <div className={s.storeHead}>
        <AppIcon build={app} className={s.appSquircle} />
        <div>
          <b>{app.title}</b>
          <span>Yash Nautiyal</span>
          <small>{app.category}</small>
        </div>
      </div>
      <a className={s.installBtn} href={app.live} {...ext}>
        Install
      </a>
      <ul className={s.storeShots}>
        {(app.store ?? app.screens).slice(0, 4).map((src, i) => (
          <li key={src}>
            <Image src={src} alt={`${app.title} screenshot ${i + 1}`} fill sizes="90px" />
          </li>
        ))}
      </ul>
      <p className={s.storeAbout}>{app.tagline}</p>
    </div>
  );
}

const mark = (text: string, words: string[] = []) => {
  if (!words.length) return text;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return text.split(re).map((part, i) => (words.includes(part) ? <b key={i}>{part}</b> : part));
};

/** Work history; the pass hanging next to the phone shows the same job. */
export function CareerScreen({ job }: { job: number }) {
  const { showPass } = usePhone();
  const j = JOBS[job];
  if (!j) return null;
  return (
    <div className={s.career} style={{ "--job": j.color } as React.CSSProperties}>
      <TopBar title="Career" tone="dark" />
      <div className={s.careerTabs} role="tablist" aria-label="Jobs">
        {JOBS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={i === job}
            onClick={() => i !== job && showPass(i)}
          >
            {x.short}
            {x.current && <i>now</i>}
          </button>
        ))}
      </div>
      <div key={j.id} className={s.careerBody}>
        <b>{j.title}</b>
        <span>
          {j.company} · {j.span}
        </span>
        <ul>
          {j.description.map((d) => (
            <li key={d}>{mark(d, j.highlights)}</li>
          ))}
        </ul>
        <p className={s.careerEdu}>{config.about.education}</p>
      </div>
    </div>
  );
}
