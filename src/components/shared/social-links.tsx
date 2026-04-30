import { config } from "@/data/config";

export function SocialLinks() {
  const links = [
    { label: "GitHub", href: config.social.github.link },
    { label: "LinkedIn", href: config.social.linkedin.link },
    { label: "Email", href: config.social.gmail.link },
  ];

  return (
    <div className="flex items-center gap-4">
      {links.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-zinc-700 transition hover:text-sky-600 dark:text-zinc-300 dark:hover:text-sky-400"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
