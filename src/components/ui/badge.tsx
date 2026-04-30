export function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex rounded-full border border-(--glass-border) bg-(--surface) px-3 py-1 text-xs font-medium text-foreground">
      {text}
    </span>
  );
}
