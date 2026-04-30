import type { ReactNode } from "react";

export function TypographyH3({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
}

export function TypographyP({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-foreground ${className}`}>{children}</p>;
}
