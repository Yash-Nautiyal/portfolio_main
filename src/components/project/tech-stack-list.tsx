import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/data/projects";

export function TechStackList({ title, skills }: { title: string; skills: Skill[] }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-foreground">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill.title} text={skill.title} />
        ))}
      </div>
    </div>
  );
}
