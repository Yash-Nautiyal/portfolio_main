import projects from "@/data/projects";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "./project-card";

export function ProjectGrid() {
  if (!projects.length) {
    return (
      <EmptyState
        title="No projects yet"
        message="Add entries in src/data/projects.tsx."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
