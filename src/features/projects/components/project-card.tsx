import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <div className="relative mb-4 h-44 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{project.title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <Tag key={item} text={item} />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <Link href={`/projects/${project.slug}`} className="text-sm font-semibold text-sky-500">
          Read case study
        </Link>
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            className="text-sm text-zinc-600 hover:text-sky-500 dark:text-zinc-400"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        ) : null}
      </div>
    </Card>
  );
}
