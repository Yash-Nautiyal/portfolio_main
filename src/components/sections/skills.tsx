import { SectionHeader } from "@/components/layout/section-header";
import { skillSectionMeta } from "@/data/section-metadata";
import { skillGroups } from "@/data/skill-showcase";
import { SkillsPills } from "./skills-pills";

export function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-28 py-14 sm:py-20">
      <SectionHeader
        label={skillSectionMeta.label}
        title={skillSectionMeta.title}
        subtitle={skillSectionMeta.subtitle}
      />
      <SkillsPills groups={skillGroups} />
    </section>
  );
}
