import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ProjectMeta } from "@/components/project/project-meta";
import projects from "@/data/projects";
import { ProjectBackButton } from "@/components/project/project-back-button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: `${project.title} case study`,
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 py-14 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <article>
            <ProjectBackButton/>
              <p className="text-sm font-semibold text-sky-500">Project Case Study</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight ">{project.title}</h1>
              <div className="prose prose-zinc mt-6 max-w-none dark:prose-invert">
                {project.content}
              </div>
            </article>
            <aside>
              <ProjectMeta project={project} />
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
