import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import projects from "@/data/projects";
import { BUILDS } from "@/data/builds";
import { AppIcon } from "@/components/hp/app-icon";
import { CaseWindow } from "@/components/project/case-window";
import { ProjectBackButton } from "@/components/project/project-back-button";
import { ProjectHero, ProjectMeta } from "@/components/project/project-meta";
import s from "@/components/project/case-study.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: `${project.title} case study`,
  };
}

const dartFile = (id: string) => `${id.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()}.dart`;

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.id === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const others = BUILDS.filter((b) => b.id !== project.id);

  return (
    <CaseWindow
      path={`yash_nautiyal / lib / builds / ${dartFile(project.id)}`}
      color={BUILDS.find((b) => b.id === project.id)?.color}
      tools={
        <>
          <ProjectBackButton />
          {next.id !== project.id && (
            <Link href={`/projects/${next.id}`} className={s.tool} aria-label={`Next build: ${next.title}`}>
              <span>Next: {next.title}</span> <ArrowRight size={13} aria-hidden />
            </Link>
          )}
        </>
      }
    >
      <div className={s.grid}>
        <aside className={s.aside}>
          <ProjectHero project={project} />
          <ProjectMeta project={project} />
        </aside>
        <article className={s.main}>
          {project.content}
          {others.length > 0 && (
            <section className={`${s.card} ${s.more}`}>
              <h2>More builds</h2>
              <ul>
                {others.map((b) => (
                  <li key={b.id}>
                    <Link href={b.href} className={s.buildRow}>
                      <AppIcon build={b} className={s.buildThumb} sizes="42px" />
                      <span>
                        <b>{b.title}</b>
                        <small>{b.tagline}</small>
                      </span>
                      <span className={s.runChip}>Case study</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
    </CaseWindow>
  );
}
