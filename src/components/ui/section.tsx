import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-28 py-14 sm:py-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
