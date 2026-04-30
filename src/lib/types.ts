export type SocialLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  tech: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description: string;
};

export type Testimonial = {
  name: string;
  role: string;
  text: string;
};
