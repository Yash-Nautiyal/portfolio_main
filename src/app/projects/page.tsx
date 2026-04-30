import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectGrid } from "@/components/project/project-grid";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies and product work across Flutter and Android.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-14 sm:py-20">
        <Container>
          <PageHeader
            title="All Projects"
            description="A curated collection of mobile apps and product engineering work."
          />
          <ProjectGrid />
        </Container>
      </main>
      <Footer />
    </>
  );
}
