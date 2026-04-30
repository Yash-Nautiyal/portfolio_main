import { LayoutSection } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";
import { contactSectionMeta } from "@/data/section-metadata";
import { config } from "@/data/config";
import { ListItem } from "../ui/listitem";

export function ContactCtaSection() {
  return (
    <LayoutSection
      id="contact"
      label={contactSectionMeta.label}
      title={contactSectionMeta.title}
      subtitle={contactSectionMeta.subtitle}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold text-foreground">Say hello 👋</h3>
          <p className="mt-2 mb-5 text-(--text-secondary)">
            Whether you have a project in mind or just want to chat about Flutter and
            Android — my inbox is always open.
          </p>

          {Object.entries(config.social).map(([key, value]) => (
            <div key={key}>
              <a href={value.link} target="_blank" rel="noopener noreferrer">
                <ListItem
                  children={
                    <div className="flex items-center gap-5 justify-start">
                      <div className="bg-(--surface) rounded-xl p-2.5">
                        <img src={value.img} alt={key} className="w-5 h-5" />
                      </div>
                      <span className="text-sm text-(--text-secondary)">{removeMailto(value.link)}</span>
                    </div>
                  }
                />
              </a>
            </div>
          ))}
        </Card>
        <Card>
          <ContactForm />
        </Card>
      </div>
    </LayoutSection>
  );
  function removeMailto(str: string) {
    return str.replace("mailto:", "");
  }
}

