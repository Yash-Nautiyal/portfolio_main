"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function ProjectBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-6 inline-flex items-center gap-2 rounded-xl border border-(--glass-border) bg-(--surface) px-3 py-2 text-sm font-medium text-foreground transition hover:bg-(--surface-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      Back
    </button>
  );
}
