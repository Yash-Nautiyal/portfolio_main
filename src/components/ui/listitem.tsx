import type { ReactNode } from "react";

export function ListItem({ children }: { children: ReactNode }) {
  return (
    <div
      className={`mt-3 rounded-2xl border border-(--glass-border) bg-(--surface) p-3 dark:shadow-none`}
    >
      {children}
    </div>
  );
}
