import { SectionHeader } from "@/components/layout/section-header";
import { EXPERIENCE, SKILLS } from "@/data/experience";
import { experienceSectionMeta } from "@/data/section-metadata";
import { renderHighlightedBullet } from "@/lib/highlight-bullet";

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-28 py-14 sm:py-20">
      <SectionHeader
        label={experienceSectionMeta.label}
        title={experienceSectionMeta.title}
        subtitle={experienceSectionMeta.subtitle}
      />

      <div className="timeline">
        {EXPERIENCE.map((item) => (
          <article key={item.id} className="timeline-item">
            <div className="timeline-dot" aria-hidden />
            <div className="timeline-header">
              <div>
                <div className="timeline-role">{item.title}</div>
                <div className="timeline-company">{item.company}</div>
              </div>
              <span className="timeline-date">
                {item.startDate} – {item.endDate}
              </span>
            </div>

            <ul className="timeline-bullet-list">
              {item.description.map((bullet) => (
                <li key={bullet} className="timeline-desc timeline-bullet-item">
                  {renderHighlightedBullet(bullet, item.highlights)}
                </li>
              ))}
            </ul>

            <div className="timeline-tech">
              {item.skills.map((skill, index) => (
                <span key={skill} className={index < 2 ? "tag accent" : "tag"}>
                  {SKILLS[skill].label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
