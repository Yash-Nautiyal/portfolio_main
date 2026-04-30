import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
      <h1 className="text-2xl font-bold">Project not found</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        The requested project does not exist or has been removed.
      </p>
      <Link href="/projects" className="mt-6 inline-block text-sm font-semibold text-sky-500">
        Back to projects
      </Link>
    </main>
  );
}
