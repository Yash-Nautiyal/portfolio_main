export function MarkdownRenderer({ content }: { content: string }) {
  return <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{content}</p>;
}
