import { SiGithub, SiGoogleplay } from "react-icons/si";
import type { Project } from "@/data/projects";
import { TechStackList } from "./tech-stack-list";
import s from "./case-study.module.css";

const ext = { target: "_blank", rel: "noopener noreferrer" };

/** Hero card: category, title, intro and the store / source buttons (the home's IntroCard + CtaCard). */
export function ProjectHero({ project }: { project: Project }) {
  return (
    <section className={`${s.card} ${s.hero}`} style={{ "--i": 0 } as React.CSSProperties}>
      <span className={s.handle}>
        <i aria-hidden /> Case study · {project.category}
      </span>
      <h1 className={s.title}>{project.title}</h1>
      <p className={s.lead}>{project.intro}</p>
      {(project.live || project.github) && (
        <div className={s.cta}>
          {project.live ? (
            <>
              <a className={s.btnMain} href={project.live} {...ext}>
                <SiGoogleplay aria-hidden /> Google Play
              </a>
              {project.github && (
                <a className={s.btnAlt} href={project.github} {...ext} aria-label="Source on GitHub">
                  <SiGithub aria-hidden />
                </a>
              )}
            </>
          ) : (
            <a className={s.btnMain} href={project.github} {...ext}>
              <SiGithub aria-hidden /> Source on GitHub
            </a>
          )}
        </div>
      )}
    </section>
  );
}

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <section className={`${s.card} ${s.stack}`} style={{ "--i": 1 } as React.CSSProperties}>
      <h2>Tech stack</h2>
      <TechStackList title="Frontend" skills={project.skills.frontend} />
      <TechStackList title="Backend" skills={project.skills.backend} />
    </section>
  );
}
