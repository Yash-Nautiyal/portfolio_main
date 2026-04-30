import type { MetadataRoute } from "next";

const baseUrl = "https://example.com";
const projectIds = ["employeeOS", "2doo", "newsfeed"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/about", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projectIds.map((id) => ({
    url: `${baseUrl}/projects/${id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes];
}
