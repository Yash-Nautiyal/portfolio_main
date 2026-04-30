import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageHeader } from "@/components/layout/page-header";
import { config } from "@/data/config";

export const metadata: Metadata = {
  title: "About",
  description: "Background, approach, and engineering values.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-14 sm:py-20">
        <Container>
          <PageHeader title="About" description={config.description.long} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
