import type { Skill } from "@/data/projects";
import s from "./case-study.module.css";

export function TechStackList({ title, skills }: { title: string; skills: Skill[] }) {
  return (
    <div className={s.stackGroup}>
      <h3>{title}</h3>
      <ul className={s.chips}>
        {skills.map((skill) => (
          <li key={skill.title} className={skill.title === "Flutter" ? `${s.chip} ${s.chipFlutter}` : s.chip}>
            {skill.icon}
            {skill.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
