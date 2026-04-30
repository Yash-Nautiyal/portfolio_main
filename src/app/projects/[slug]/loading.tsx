import { Spinner } from "@/components/ui/spinner";

export default function ProjectLoading() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-4 py-16">
      <div className="flex items-center gap-3 text-sm text-zinc-500">
        <Spinner />
        Loading project details...
      </div>
    </main>
  );
}
