import { SocialLinks } from "@/components/shared/social-links";

export function Footer() {
  return (
    <footer className="border-t border-(--glass-border) py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-4 text-sm text-zinc-700 dark:text-zinc-300 sm:flex-row">
        <p>Built with Next.js, TypeScript and Tailwind CSS.</p>
        <SocialLinks />
      </div>
    </footer>
  );
}
