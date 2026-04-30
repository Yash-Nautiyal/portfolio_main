export function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-8 text-center dark:border-red-900/60 dark:bg-red-950/20">
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">{title}</h3>
      <p className="mt-2 text-sm text-red-600/90 dark:text-red-300/90">{message}</p>
    </div>
  );
}
