"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import s from "./case-study.module.css";

/** Goes back to where the visitor came from on this site (the phone), else home. */
export function ProjectBackButton() {
  const router = useRouter();

  return (
    <Link
      href="/"
      className={s.tool}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (!document.referrer.startsWith(location.origin) || history.length < 2) return;
        e.preventDefault();
        router.back();
      }}
    >
      <ArrowLeft size={13} aria-hidden /> <span>Back</span>
    </Link>
  );
}
