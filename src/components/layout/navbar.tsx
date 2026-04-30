"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { config } from "@/data/config";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") return;

    const ids = navItems.map((item) => item.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const updateActive = () => {
      const offset = window.scrollY + 180;
      let current = sections[0]?.id ?? "home";
      for (const section of sections) {
        if (section.offsetTop <= offset) {
          current = section.id;
        }
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = sections[sections.length - 1]?.id ?? current;
      }
      setActiveSection(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [pathname]);

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-6xl px-4">
      <nav className="flex items-center justify-between rounded-2xl border border-(--glass-border) bg-(--nav-bg) px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-md dark:shadow-none">
        <Link href="/" className="text-sm font-bold tracking-wide text-foreground">
          {config.author}
        </Link>
        <ul className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => {
            const href = pathname === "/" ? item.href : `/${item.href}`;
            return (
              <li key={item.label}>
                <Link
                  href={href}
                  className={`rounded-full px-3 py-1.5 text-sm transition hover:text-sky-500 ${
                    pathname === "/" && activeSection === item.href.replace("#", "")
                      ? "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
                      : "text-(--text-tertiary)"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
