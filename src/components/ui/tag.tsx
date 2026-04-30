export function Tag({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
      {text}
    </span>
  );
}
