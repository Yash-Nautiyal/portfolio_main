import type { Project } from "@/data/projects";
import { Card } from "@/components/ui/card";
import { TechStackList } from "./tech-stack-list";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <Card className="sticky top-24">
      <p className="text-xs uppercase tracking-wide text-sky-500">{project.category}</p>
      <h3 className="mt-2 text-xl font-semibold text-foreground">{project.title}</h3>
      <div className="mt-5 space-y-4">
        <TechStackList title="Frontend" skills={project.skills.frontend} />
        <TechStackList title="Backend" skills={project.skills.backend} />
      </div>
      <div className="mt-5 flex gap-2">
        {project.github ? (
          <a href={project.github} target="_blank" rel="noreferrer">
            <Button size="sm">GitHub</Button>
          </a>
        ) : null}
        {project.live ? (
          <a href={project.live} target="_blank" rel="noreferrer">
            <Image
              src={"https://play.google.com/intl/en_us/badges/images/apps/en-play-badge.png"}
              alt="Get it on Google Play"
              width={120}
              height={120}
            />
          </a>
        ) : null}
      </div>
    </Card>
  );
}
