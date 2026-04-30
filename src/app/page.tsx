import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { HeroSection } from "@/components/sections/hero";
import { SkillsSection } from "@/components/sections/skills";
import { ExperienceSection } from "@/components/sections/experience";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects";
import { ContactCtaSection } from "@/components/sections/contact-cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container>
          <HeroSection />
          <SkillsSection />
          <ExperienceSection />
          <FeaturedProjectsSection />
          <ContactCtaSection />
        </Container>
      </main>
      <Footer />
    </>
  );
}
