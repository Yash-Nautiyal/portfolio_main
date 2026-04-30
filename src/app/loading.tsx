import { Spinner } from "@/components/ui/spinner";

export default function GlobalLoading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-zinc-500">
        <Spinner />
        Loading portfolio...
      </div>
    </main>
  );
}
