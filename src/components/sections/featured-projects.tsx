import projects from "@/data/projects";
import { projectsSectionMeta } from "@/data/section-metadata";
import { LayoutSection } from "@/components/layout/section";
import { ProjectCard } from "@/components/project/project-card";

export function FeaturedProjectsSection() {
  const featured = projects.slice(0, 3);
  return (
    <LayoutSection
      id="projects"
      label={projectsSectionMeta.label}
      title={projectsSectionMeta.title}
      subtitle={projectsSectionMeta.subtitle}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </LayoutSection>
  );
}
