import { config } from "@/data/config";

export function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {Object.entries(config.social).map(([key, value]) => (
        <a
          key={key}
          href={value.link}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-(--text-secondary) transition hover:text-sky-600 dark:hover:text-sky-400"
        >
          {key === "gmail" ? "Email" : key.charAt(0).toUpperCase() + key.slice(1)}
        </a>
      ))}
    </div>
  );
}
