import SlideShow from "@/components/project/project-gallery";
import {
  HighlightSkill,
  HighlightSubskill,
} from "@/components/project/description-highlights";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { RiReactjsFill } from "react-icons/ri";
import {
  SiFlutter,
  SiSupabase,
  SiFirebase,
  SiPostgresql,
  SiDart,
  SiMongodb,
} from "react-icons/si";
const BASE_PATH = "/assets/projects";

const ProjectsLinks = ({ live, repo }: { live?: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={live}
        >
          <Button variant={"default"} size={"sm"}>
            Visit Website
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};
const PROJECT_SKILLS = {
  dart: {
    title: "Dart",
    bg: "black",
    fg: "white",
    icon: <SiDart />,
  },
  flutter: {
    title: "Flutter",
    bg: "black",
    fg: "white",
    icon: <SiFlutter />,
  },

  postgres: {
    title: "PostgreSQL",
    bg: "black",
    fg: "white",
    icon: <SiPostgresql />,
  },

  firebase: {
    title: "Firebase",
    bg: "black",
    fg: "white",
    icon: <SiFirebase />,
  },

  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },

  supabase: {
    title: "Supabase",
    bg: "black",
    fg: "white",
    icon: <SiSupabase />,
  },

  mongodb: {
    title: "MongoDB",
    bg: "black",
    fg: "white",
    icon: <SiMongodb />,
  },
};
export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode;
  github?: string;
  live: string;
};
const projects: Project[] = [
  {
    id: "employeeOS",
    category: "Enterprise Operations",
    title: "EmployeeOS",
    src: "/assets/projects/employeeOS/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [PROJECT_SKILLS.flutter, PROJECT_SKILLS.dart],
      backend: [
        PROJECT_SKILLS.supabase,
        PROJECT_SKILLS.firebase,
        PROJECT_SKILLS.mongodb,
        PROJECT_SKILLS.postgres,
      ],
    },
    github: "https://github.com/Yash-Nautiyal/employeeOS_mobile.git",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            EmployeeOS is a <HighlightSkill>Flutter</HighlightSkill> app that unifies internal
            operations into one mobile platform. It replaces scattered tools for communication,
            hiring, task tracking, and file management with a single, role-aware workspace.
          </TypographyP>
    
          <ProjectsLinks repo={this.github} />
    
          <TypographyH3 className="my-4 mt-8">Tech Stack & Architecture</TypographyH3>
          <p className="font-mono mb-2">
            Built using <HighlightSubskill>MVVM Architecture</HighlightSubskill> with modular,
            reusable components for maintainability and scale. Core engineering focus includes{" "}
            <HighlightSubskill>State Management</HighlightSubskill>,{" "}
            <HighlightSubskill>REST API Integration</HighlightSubskill>,{" "}
            <HighlightSubskill>Role-Based Access Control</HighlightSubskill>,{" "}
            <HighlightSubskill>Realtime Messaging</HighlightSubskill>, and{" "}
            <HighlightSubskill>Theme System Design</HighlightSubskill>.
          </p>
    
          <TypographyH3 className="my-4 mt-8">Problem Solved</TypographyH3>
          <p className="font-mono mb-2">
            Teams often rely on disconnected products for chat, recruitment, tasks, and files,
            causing context switching, duplicated effort, and slower decisions. EmployeeOS
            centralizes these workflows to improve operational speed and visibility.
          </p>
    
          <TypographyH3 className="my-4 mt-8">UI/UX</TypographyH3>
          <p className="font-mono mb-2">
            Designed a clean interface inspired by{" "}
            <HighlightSubskill>Material Design</HighlightSubskill> and productivity-first
            layouts. Implemented responsive views, reusable UI patterns, dark/light mode, and
            user-selectable themes and fonts for personalization and consistency.
          </p>
          <SlideShow
            variant="mobile-multi"
            images={[
              `${BASE_PATH}/employeeOS/welcome.jpg`,
              `${BASE_PATH}/employeeOS/nav.jpg`,
              `${BASE_PATH}/employeeOS/nav2.jpg`,
              `${BASE_PATH}/employeeOS/settings.jpg`,
              `${BASE_PATH}/employeeOS/settings_dark.jpg`,
              `${BASE_PATH}/employeeOS/nav_dark.jpg`,
              `${BASE_PATH}/employeeOS/welcome_dark.jpg`,
            ]}
          />
    
          <TypographyH3 className="my-4 mt-8">Hiring Dashboard</TypographyH3>
          <p className="font-mono mb-2">
            Built a centralized hiring pipeline to track candidates across stages, improve
            recruiter visibility, and speed up decision-making.
          </p>
          <SlideShow
            variant="mobile-multi"
            images={[
              `${BASE_PATH}/employeeOS/hiring1.jpg`,
              `${BASE_PATH}/employeeOS/hiring2.jpg`,
              `${BASE_PATH}/employeeOS/hiring3.jpg`,
              `${BASE_PATH}/employeeOS/hiring4.jpg`,
              `${BASE_PATH}/employeeOS/hiring5.jpg`,
            ]}
          />
    
          <TypographyH3 className="my-4 mt-8">Chat</TypographyH3>
          <p className="font-mono mb-2">
            Implemented real-time, thread-based team messaging to reduce dependency on external
            tools and keep discussions aligned with internal workflows.
          </p>
          <SlideShow
            variant="mobile-multi"
            images={[`${BASE_PATH}/employeeOS/welcome.jpg`]}
          />
    
          <TypographyH3 className="my-4 mt-8">Kanban</TypographyH3>
          <p className="font-mono mb-2">
            Created a collaborative task board for planning, assigning, and tracking work with
            clear workflow status across teams.
          </p>
          <SlideShow
            variant="mobile-multi"
            images={[
              `${BASE_PATH}/employeeOS/kanban1.jpg`,
              `${BASE_PATH}/employeeOS/kanban2.jpg`,
              `${BASE_PATH}/employeeOS/kanban3.jpg`,
              `${BASE_PATH}/employeeOS/kanban4.jpg`,
            ]}
          />
    
          <TypographyH3 className="my-4 mt-8">File Manager</TypographyH3>
          <p className="font-mono mb-2">
            Delivered a secure shared file workspace for uploading, organizing, and accessing
            team assets with role-aware visibility.
          </p>
          <SlideShow
            variant="mobile-multi"
            images={[
              `${BASE_PATH}/employeeOS/filemanager1.jpg`,
              `${BASE_PATH}/employeeOS/filemanager2.jpg`,
              `${BASE_PATH}/employeeOS/filemanager3.jpg`,
              `${BASE_PATH}/employeeOS/filemanager4.jpg`,
            ]}
          />
    
          <TypographyH3 className="my-4 mt-8">Recruitment</TypographyH3>
          <p className="font-mono mb-2">
            Supported end-to-end recruitment workflows: posting roles, collecting applications,
            screening candidates, and managing interview/hiring stages.
          </p>
          <SlideShow
            variant="mobile-multi"
            images={[
              `${BASE_PATH}/employeeOS/posting1.jpg`,
              `${BASE_PATH}/employeeOS/posting2.jpg`,
              `${BASE_PATH}/employeeOS/posting3.jpg`,
              `${BASE_PATH}/employeeOS/posting4.jpg`,
              `${BASE_PATH}/employeeOS/posting5.jpg`,
              `${BASE_PATH}/employeeOS/application.jpg`,
              `${BASE_PATH}/employeeOS/interview.jpg`,
            ]}
          />
    
          <TypographyH3 className="my-4 mt-8">Users & Access Control</TypographyH3>
          <p className="font-mono mb-2">
            Implemented user lifecycle management, profile controls, and role-based permission
            handling for secure organization-level administration.
          </p>
          <SlideShow
            variant="mobile-multi"
            images={[
              `${BASE_PATH}/employeeOS/user1.jpg`,
              `${BASE_PATH}/employeeOS/user2.jpg`,
              `${BASE_PATH}/employeeOS/user3.jpg`,
              `${BASE_PATH}/employeeOS/user4.jpg`,
              `${BASE_PATH}/employeeOS/create_user.jpg`,
            ]}
          />
        </div>
      );
    },
    live: "",
  },
  {
    id: "2doo",
    category: "Task Management App",
    title: "2DOO",
    src: "/assets/projects/2doo/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [PROJECT_SKILLS.flutter, PROJECT_SKILLS.dart],
      backend: [
        PROJECT_SKILLS.supabase,
        PROJECT_SKILLS.firebase,
        PROJECT_SKILLS.postgres,
      ],
    },
    live: "",
    github: "https://github.com/Yash-Nautiyal/2D00.git",
    get content(): React.JSX.Element {
      return (
        <div>
          <TypographyP className="font-mono">
            2DOO is a production-grade task management app built to help users plan
            smarter, stay focused, and never miss deadlines. It combines a clean, minimal
            interface with powerful productivity workflows such as overdue tracking, push
            notifications, and real-time synchronization.
          </TypographyP>

          <ProjectsLinks repo={this.github} />

          <TypographyH3 className="my-4">Key Features</TypographyH3>
          <ul className="font-mono mb-2 list-disc list-inside">
            <li>
              Full <HighlightSubskill>CRUD</HighlightSubskill> workflows for tasks and
              subtasks
            </li>
            <li>
              Smart due-date handling with automated{" "}
              <HighlightSubskill>Overdue Tracking</HighlightSubskill>
            </li>
            <li>
              Local and remote <HighlightSubskill>Push Notifications</HighlightSubskill>{" "}
              for timely reminders
            </li>
            <li>
              <HighlightSubskill>Real-time Sync</HighlightSubskill> across sessions and
              devices
            </li>
            <li>
              Dynamic categorization, filtering, and priority-based task organization
            </li>
          </ul>

          <TypographyH3 className="my-4 mt-8">Architecture & Engineering</TypographyH3>
          <p className="font-mono mb-2">
            The app follows a feature-first layered architecture with{" "}
            <HighlightSubskill>BLoC</HighlightSubskill> state management and the{" "}
            <HighlightSubskill>Repository Pattern</HighlightSubskill> for clean separation
            of concerns. The codebase is organized for scalability and maintainability
            using reusable modules, explicit state transitions, and predictable data flow.
          </p>
          <p className="font-mono mb-2">
            Backend capabilities are powered by{" "}
            <HighlightSubskill>Supabase Auth</HighlightSubskill> and{" "}
            <HighlightSubskill>PostgreSQL</HighlightSubskill>, including secure
            authentication, real-time updates, and reliable cloud persistence.
          </p>

          <SlideShow
            variant="playstore"
            images={[
              `${BASE_PATH}/2doo/Samsung Galaxy S21 Ultra Screenshot 1.png`,
              `${BASE_PATH}/2doo/Samsung Galaxy S21 Ultra Screenshot 2.png`,
              `${BASE_PATH}/2doo/Samsung Galaxy S21 Ultra Screenshot 3.png`,
              `${BASE_PATH}/2doo/Samsung Galaxy S21 Ultra Screenshot 4.png`,
              `${BASE_PATH}/2doo/Samsung Galaxy S21 Ultra Screenshot 5.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">UI/UX & Product Design</TypographyH3>
          <p className="font-mono mb-2">
            Designed a modern, productivity-focused interface inspired by{" "}
            <HighlightSubskill>Material Design</HighlightSubskill>. Built modular and
            reusable UI components with responsive layouts, consistent visual language,
            and personalization features such as light/dark mode, preset color themes, and
            typography controls.
          </p>

          <TypographyH3 className="my-4 mt-8">Delivery & Impact</TypographyH3>
          <p className="font-mono mb-2">
            2DOO demonstrates complete end-to-end product ownership from architecture and
            implementation to release engineering. The app was compiled into an optimized{" "}
            <HighlightSubskill>12.3 MB</HighlightSubskill> Android App Bundle and
            successfully shipped via the{" "}
            <HighlightSubskill>Google Play Console</HighlightSubskill>, highlighting
            production-ready <HighlightSkill>Flutter</HighlightSkill> and{" "}
            <HighlightSkill>Dart</HighlightSkill> development practices.
          </p>
        </div>
      );
    },
  },
  {
    id: "newsfeed",
    category: "News App",
    title: "NewsFeed",
    src: "/assets/projects/newsfeed/landing.png",
    screenshots: ["landing.png"],
    live: "",
    github: "https://github.com/Yash-Nautiyal/NewsFeed.git",
    skills: {
      frontend: [PROJECT_SKILLS.flutter, PROJECT_SKILLS.dart],
      backend: [PROJECT_SKILLS.firebase, PROJECT_SKILLS.mongodb],
    },
    get content() {
      return (
        <div className="space-y-6">
          <TypographyP className="font-mono text-lg leading-relaxed">
            NewsFeed is a production-style <HighlightSkill>Flutter</HighlightSkill> and{" "}
            <HighlightSkill>Dart</HighlightSkill> application focused on real-time news
            consumption, category-based browsing, and fake-news verification.
          </TypographyP>

          <ProjectsLinks repo={this.github} />

          <div>
            <TypographyH3 className="mb-3">Core Features</TypographyH3>
            <ul className="font-mono list-disc list-inside space-y-2">
              <li>
                <HighlightSubskill>Fake-news detection</HighlightSubskill> for text and
                images using external Flask ML endpoints.
              </li>
              <li>
                Advanced keyword search with date-range filters and category filtering.
              </li>
              <li>
                Secure <HighlightSkill>Firebase</HighlightSkill>{" "}
                <HighlightSubskill>Authentication</HighlightSubskill> (Email/Password &
                Google Sign-In) with{" "}
                <HighlightSubskill>SharedPreferences</HighlightSubskill> session routing.
              </li>
              <li>
                <HighlightSubskill>Cloud Firestore</HighlightSubskill> integrations for
                personalized bookmark persistence and profile management.
              </li>
            </ul>
          </div>

          <div>
            <TypographyH3 className="mb-3">Architecture & UI</TypographyH3>
            <p className="font-mono leading-relaxed">
              Engineered with a feature-first modular structure utilizing{" "}
              <HighlightSubskill>BLoC</HighlightSubskill> for predictable state
              management. The UI features a draggable and animated home layout, swipeable
              breaking-news cards, and polished loading/error states built on{" "}
              <HighlightSubskill>Material</HighlightSubskill> design principles.
            </p>
          </div>

          <SlideShow
            variant="mobile-multi"
            images={[
              `${BASE_PATH}/newsfeed/home.jpg`,
              `${BASE_PATH}/newsfeed/home2.jpg`,
              `${BASE_PATH}/newsfeed/home_filter.jpg`,
              `${BASE_PATH}/newsfeed/fake.jpg`,
              `${BASE_PATH}/newsfeed/detail.jpg`,
            ]}
          />
        </div>
      );
    },
  },
];
export default projects;
