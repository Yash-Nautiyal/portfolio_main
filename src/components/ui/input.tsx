import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full mt-1.5 rounded-xl border border-(--glass-border) bg-(--surface) px-4 py-3 text-sm text-foreground placeholder:text-(--text-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${props.className ?? ""}`}
    />
  );
}
