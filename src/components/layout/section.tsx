import type { ReactNode } from "react";
import { SectionHeader } from "./section-header";

export function LayoutSection({
  id,
  label,
  title,
  subtitle,
  children,
}: {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-14 sm:py-20">
      <SectionHeader label={label} title={title} subtitle={subtitle} />
      {children}
    </section>
  );
}
