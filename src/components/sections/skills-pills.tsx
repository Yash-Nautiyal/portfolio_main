"use client";

import Image from "next/image";
import type { KeyboardEvent } from "react";
import { useCallback, useState } from "react";
import type { SkillGroupData, SkillPillData } from "@/data/skill-showcase";

function SkillPillInner({
  pill,
  open,
  onToggle,
}: {
  pill: SkillPillData;
  open: boolean;
  onToggle: () => void;
}) {
  const expandable = Boolean(pill.expandable && pill.subChips?.length);

  return (
    <div className={`skill-pill-wrap ${open ? "open" : ""}`}>
      <div
        className={`skill-pill ${pill.primary ? "primary" : ""} ${expandable ? "expandable" : ""} ${pill.dim ? "dim" : ""}`}
        {...(expandable
          ? {
              role: "button" as const,
              tabIndex: 0,
              onClick: onToggle,
              onKeyDown: (e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle();
                }
              },
            }
          : {})}
      >
        <Image
          src={pill.icon}
          alt={pill.alt}
          width={20}
          height={20}
          className={`h-5 w-5 object-contain ${pill.iconInvert ? "skill-pill-icon-invert" : ""}`}
        />
        <span className="skill-pill-name">{pill.name}</span>
        {expandable ? (
          <span className="skill-chevron" aria-hidden>
            ›
          </span>
        ) : null}
        {pill.tooltip ? <div className="skill-tooltip">{pill.tooltip}</div> : null}
      </div>
      {expandable && pill.subChips?.length ? (
        <div className="sub-chips">
          {pill.subChips.map((chip) => (
            <span key={chip} className="sub-chip">
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SkillGroupBlock({ group }: { group: SkillGroupData }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((pill: SkillPillData) => {
    if (!pill.expandable || !pill.subChips?.length) return;
    setOpenId((prev) => (prev === pill.id ? null : pill.id));
  }, []);

  return (
    <div className="skill-group">
      <div className="skill-group-header">
        <div className="skill-group-dot" style={{ background: group.dotColor }} />
        <span className="skill-group-label">{group.label}</span>
        <div className="skill-group-line" />
      </div>
      <div className="skill-pills">
        {group.pills.map((pill) => (
          <SkillPillInner
            key={pill.id}
            pill={pill}
            open={openId === pill.id}
            onToggle={() => toggle(pill)}
          />
        ))}
      </div>
    </div>
  );
}

export function SkillsPills({ groups }: { groups: SkillGroupData[] }) {
  return (
    <div className="skills-pills-root space-y-9">
      {groups.map((group) => (
        <SkillGroupBlock key={group.id} group={group} />
      ))}
    </div>
  );
}
