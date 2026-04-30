/**
 * Skills UI: grouped pill rows (matches demo.html — expandable chips + tooltips).
 */

export type SkillPillData = {
  id: string;
  icon: string;
  name: string;
  alt: string;
  /** Accent border (mobile stack) */
  primary?: boolean;
  expandable?: boolean;
  tooltip?: string;
  subChips?: string[];
  dim?: boolean;
  /** Dark-mode invert for light logos (GitHub, Vercel) */
  iconInvert?: boolean;
};

export type SkillGroupData = {
  id: string;
  dotColor: string;
  label: string;
  pills: SkillPillData[];
};

export const skillGroups: SkillGroupData[] = [
  {
    id: "mobile-core",
    dotColor: "var(--accent)",
    label: "Mobile Core",
    pills: [
      {
        id: "flutter",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
        name: "Flutter",
        alt: "Flutter",
        primary: true,
        expandable: true,
        subChips: [
          "BLoC",
          "Riverpod",
          "Provider",
          "Custom Painter",
          "Animations",
          "Isolates",
          "Platform Channels",
        ],
      },
      {
        id: "dart",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
        name: "Dart",
        alt: "Dart",
        primary: true,
        tooltip:
          "Typed language optimized for Flutter, web, and server workloads.",
      },
      {
        id: "android",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
        name: "Android",
        alt: "Android",
        primary: true,
        expandable: true,
        subChips: ["Jetpack Compose", "MVVM", "MVP", "WorkManager", "Room DB", "Retrofit"],
      },
      {
        id: "kotlin",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
        name: "Kotlin",
        alt: "Kotlin",
        primary: true,
        tooltip: "Android's official programming language for building native apps.",
      },
    ],
  },
  {
    id: "backend-db",
    dotColor: "#a855f7",
    label: "Backend & Database",
    pills: [
      {
        id: "firebase",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
        name: "Firebase",
        alt: "Firebase",
        expandable: true,
        subChips: ["FCM", "Firestore", "Auth", "Cloud Functions", "Realtime DB", "Storage"],
      },
      {
        id: "supabase",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
        name: "Supabase",
        alt: "Supabase",
        expandable: true,
        subChips: ["Auth", "Storage / Buckets", "RPC", "Edge Functions", "Realtime"],
      },
      {
        id: "postgres",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        name: "PostgreSQL",
        alt: "PostgreSQL",
        tooltip:
          "Robust open-source SQL database with advanced features and reliability.",
      },
      {
        id: "mongodb",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        name: "MongoDB",
        alt: "MongoDB",
        tooltip:
          "Document database for flexible, scalable JSON-like data storage.",
      },
      {
        id: "mysql",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        name: "MySQL",
        alt: "MySQL",
        tooltip: "Widely used open-source relational database and SQL engine.",
      },
    ],
  },
  {
    id: "design-ui",
    dotColor: "var(--accent-2)",
    label: "Design & UI",
    pills: [
      {
        id: "figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        name: "Figma",
        alt: "Figma",
        tooltip:
          "Design tool for wireframes, prototypes, and pixel-perfect designs.",
      },
      {
        id: "tailwind",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        name: "Tailwind CSS",
        alt: "Tailwind",
        tooltip:
          "Utility-first CSS — design-system thinking applies to Flutter theming too.",
      },
    ],
  },
  {
    id: "tools",
    dotColor: "var(--text-tertiary)",
    label: "Tools & Platforms",
    pills: [
      {
        id: "git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        name: "Git",
        alt: "Git",
        tooltip:
          "Distributed version control for branches, history, and collaboration.",
      },
      {
        id: "github",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
        name: "GitHub",
        alt: "GitHub",
        iconInvert: true,
        tooltip: "Git hosting, code review, issues, and CI/CD workflows.",
      },
      {
        id: "android-studio",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg",
        name: "Android Studio",
        alt: "Android Studio",
        tooltip:
          "Official Android IDE: emulator, Gradle, and debugging tools.",
      },
      {
        id: "vscode",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
        name: "VSCode",
        alt: "VSCode",
        tooltip:
          "Extensible code editor with rich debugging and extension ecosystem.",
      },
      {
        id: "play-store",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
        name: "Play Store",
        alt: "Play Store",
        tooltip:
          "Google's storefront for publishing and distributing Android apps.",
      },
      {
        id: "app-store",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
        name: "App Store",
        alt: "App Store",
        tooltip:
          "Apple's marketplace for iOS, iPadOS, and Mac app distribution.",
      },
      {
        id: "vercel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
        name: "Vercel",
        alt: "Vercel",
        iconInvert: true,
        tooltip: "Edge-first hosting and previews for Next.js and frontend apps.",
      },
    ],
  },
  {
    id: "also-familiar",
    dotColor: "var(--text-tertiary)",
    label: "Also familiar with",
    pills: [
      {
        id: "react",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        name: "React",
        alt: "React",
        dim: true,
        tooltip:
          "Component-based library for building interactive user interfaces.",
      },
      {
        id: "html",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        name: "HTML",
        alt: "HTML",
        dim: true,
        tooltip: "Markup for structuring content and semantics on the web.",
      },
      {
        id: "css",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        name: "CSS",
        alt: "CSS",
        dim: true,
        tooltip:
          "Styles layout, typography, animation, and responsive design.",
      },
      {
        id: "wordpress",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
        name: "WordPress",
        alt: "WordPress",
        dim: true,
        tooltip:
          "CMS for blogs, marketing sites, and plugin-based extensions.",
      },
    ],
  },
];
