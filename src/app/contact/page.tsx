import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact me for jobs, contracts, and collaborations.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-14 sm:py-20">
        <Container>
          <PageHeader title="Contact" description="Send a direct email inquiry through this form." />
          <Card>
            <ContactForm />
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  );
}
