// thoda zada ts ho gya idhar
export enum SkillNames {
  // row 1
  FLUTTER = "flutter",
  DART = "dart",
  ANDROID = "android",
  // row 2
  SUPABASE = "supabase",
  POSTGRES = "postgres",
  // row 3
  GIT = "git",
  GITHUB = "github",
  FIREBASE = "firebase",
  // row 4
  ANDROIDSTUDIO = "androidstudio",
  VSCODE = "vscode",
}
export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};
export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.FLUTTER]: {
    id: 1,
    name: "flutter",
    label: "Flutter",
    shortDescription: "Cross-platform UI toolkit for native-feeling mobile and desktop apps.",
    color: "#2496ED",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  },
  [SkillNames.DART]: {
    id: 2,
    name: "dart",
    label: "Dart",
    shortDescription: "Typed language optimized for Flutter, web, and server workloads.",
    color: "#007ACC",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  },
  [SkillNames.ANDROID]: {
    id: 6,
    name: "android",
    label: "Android",
    shortDescription: "Google’s mobile OS and toolkit for native Android apps.",
    color: "#41B883",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
  },
  [SkillNames.SUPABASE]: {
    id: 10,
    name: "supabase",
    label: "Supabase",
    shortDescription: "Open-source BaaS: Postgres, auth, storage, and realtime APIs.",
    color: "#008000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
  },
  [SkillNames.POSTGRES]: {
    id: 11,
    name: "postgres",
    label: "PostgreSQL",
    shortDescription: "Robust open-source SQL database with advanced features and reliability.",
    color: "#336791",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  [SkillNames.GIT]: {
    id: 13,
    name: "git",
    label: "Git",
    shortDescription: "Distributed version control for branches, history, and collaboration.",
    color: "#343434",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  [SkillNames.GITHUB]: {
    id: 14,
    name: "github",
    label: "GitHub",
    shortDescription: "Git hosting, code review, issues, and CI/CD workflows.",
    color: "#000000",
    icon: "https://img.icons8.com/material-rounded/24/github.png",
  },
  [SkillNames.FIREBASE]: {
    id: 17,
    name: "firebase",
    label: "Firebase",
    shortDescription: "Google’s BaaS: auth, Firestore, hosting, and cloud functions.",
    color: "#ffca28",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  },
  [SkillNames.ANDROIDSTUDIO]: {
    id: 21,
    name: "androidstudio",
    label: "Android Studio",
    shortDescription: "Official Android IDE: emulator, Gradle, and debugging tools.",
    color: "#019331",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg",
  },
  [SkillNames.VSCODE]: {
    id: 26,
    name: "vscode",
    label: "VSCode",
    shortDescription: "Extensible code editor with rich debugging and extension ecosystem.",
    color: "#2496ED",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  }
};

export type Experience = {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  company: string;
  description: string[];
  skills: SkillNames[];
  highlights?: string[]; // keywords to accent in description bullets
};

// Source: CV (Jake_s_Resume__Anonymous_-3.pdf, Oct 2026). Newest job first.
export const EXPERIENCE: Experience[] = [
  {
    id: 2,
    startDate: "Jul 2026",
    endDate: "Present",
    title: "Flutter Developer",
    company: "AppX",
    description: [
      "Built production-grade Flutter app within a week, following Clean Architecture and BLoC for maintainability and testability.",
      "Worked on revamping company’s legacy app framework UI which is currently implemented in 500+ clients apps each having 1L+ users.",
    ],
    skills: [SkillNames.FLUTTER, SkillNames.DART, SkillNames.ANDROIDSTUDIO, SkillNames.GIT],
    highlights: ["Flutter", "Clean Architecture", "BLoC", "500+", "1L+"],
  },
  {
    id: 1,
    startDate: "Jan 2025",
    endDate: "Jul 2026",
    title: "Flutter Developer",
    company: "F13 Technologies",
    description: [
      "Architected 2 production-grade mobile applications used by 30+ users and organisation member using Flutter and Dart, implementing Clean Architecture and BLoC for maintainability and testability.",
      "Optimized application performance by implementing lazy loading and efficient state management, resulting in a 35% reduction in memory usage and smoother UI rendering at 60 FPS.",
      "Integrated Firebase Cloud Messaging (FCM) and automated authentication flows, increasing user engagement metrics by 40% through timely, context-aware notifications.",
    ],
    skills: [
      SkillNames.DART,
      SkillNames.FLUTTER,
      SkillNames.FIREBASE,
      SkillNames.SUPABASE,
      SkillNames.ANDROIDSTUDIO,
      SkillNames.VSCODE,
      SkillNames.GIT,
      SkillNames.GITHUB,
      SkillNames.ANDROID,
    ],
    highlights: [
      "Flutter",
      "Dart",
      "Clean Architecture",
      "BLoC",
      "30+",
      "lazy loading",
      "35%",
      "60 FPS",
      "Firebase Cloud Messaging (FCM)",
      "40%",
    ],
  },
];

export const themeDisclaimers = {
  light: [
    "Warning: Light mode emits a gazillion lumens of pure radiance!",
    "Caution: Light mode ahead! Please don't try this at home.",
    "Only trained professionals can handle this much brightness. Proceed with sunglasses!",
    "Brace yourself! Light mode is about to make everything shine brighter than your future.",
    "Flipping the switch to light mode... Are you sure your eyes are ready for this?",
  ],
  dark: [
    "Light mode? I thought you went insane... but welcome back to the dark side!",
    "Switching to dark mode... How was life on the bright side?",
    "Dark mode activated! Thanks you from the bottom of my heart, and my eyes too.",
    "Welcome back to the shadows. How was life out there in the light?",
    "Dark mode on! Finally, someone who understands true sophistication.",
  ],
};