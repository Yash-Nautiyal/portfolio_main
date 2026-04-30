type SectionHeaderProps = {
  label: string;
  title: string;
  subtitle?: string;
};

/**
 * Shared section intro (matches demo.html: section-label, section-title, section-sub).
 * Styling lives in globals.css using theme tokens (--accent, --foreground, --text-secondary).
 */
export function SectionHeader({ label, title, subtitle }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <p className="section-label">{label}</p>
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="section-sub">{subtitle}</p> : null}
    </header>
  );
}
