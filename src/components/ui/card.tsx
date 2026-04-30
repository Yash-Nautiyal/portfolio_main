import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-(--glass-border) bg-(--surface) p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] backdrop-blur-sm dark:shadow-none ${className}`}
    >
      {children}
    </article>
  );
}
