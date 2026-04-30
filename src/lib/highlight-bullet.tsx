import { Fragment } from "react";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Wraps known keywords from experience bullets (see EXPERIENCE.highlights).
 */
export function renderHighlightedBullet(text: string, highlights?: string[]) {
  if (!highlights?.length) return text;

  const unique = [...new Set(highlights)].filter(Boolean);
  const sorted = unique.sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern).filter((p) => p.length > 0);

  return parts.map((part, i) => {
    const matched = sorted.find((h) => h.toLowerCase() === part.toLowerCase());
    if (!matched) return <Fragment key={`${i}-${part.slice(0, 12)}`}>{part}</Fragment>;
    const isNumLike = /[~$%]|\d/.test(part);
    return (
      <span key={`${i}-${part}`} className={isNumLike ? "kw-num" : "kw"}>
        {part}
      </span>
    );
  });
}
