import type { Metadata } from "next";
import { config } from "@/data/config";

export function buildPageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/assets/seo/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: config.keywords,
  };
}
