import { SocialLinks } from "@/components/shared/social-links";
import { config } from "@/data/config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-(--glass-border) py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-4 text-sm text-(--text-tertiary) sm:flex-row">
        <p>
          {" "}
          © {year} {config.author}. All rights reserved.
        </p>
        <SocialLinks />
      </div>
    </footer>
  );
}
