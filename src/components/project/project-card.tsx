import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { Card } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative h-56 bg-(--surface) rounded-xl">
        <Image
          src={project.src}
          alt={project.title}
          fill
          className="object-cover rounded-xl"
          sizes="50vw"
        />
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-sky-500">{project.category}</p>
        <h3 className="mt-2 text-xl font-bold text-foreground">{project.title}</h3>
        <Link
          href={`/projects/${project.id}`}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-(--glass-border) bg-(--surface) px-3 py-2 text-sm font-medium text-foreground transition hover:bg-(--surface-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
        >
          <div className="flex items-center gap-2">
            <p>View details</p>
            <ArrowRightIcon className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </Card>
  );
}
