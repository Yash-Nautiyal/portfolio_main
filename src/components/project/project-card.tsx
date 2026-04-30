import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { Card } from "@/components/ui/card";

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
      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-sky-500">{project.category}</p>
        <h3 className="mt-2 text-xl font-semibold text-foreground">{project.title}</h3>
        <Link
          href={`/projects/${project.id}`}
          className="mt-4 inline-block text-sm font-medium text-(--accent) hover:text-(--accent)"
        >
          View details
        </Link>
      </div>
    </Card>
  );
}
