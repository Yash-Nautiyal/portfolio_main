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
          <TypographyP className="font-mono ">
            EmployeeOS is a <HighlightSkill>Flutter</HighlightSkill> application built to
            centralize day-to-day employee workflows in one place. It is designed to make
            internal operations smoother by combining communication, recruitment, and
            productivity tools into a single mobile experience.
          </TypographyP>
          <ProjectsLinks repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Problems </TypographyH3>
          <p className="font-mono mb-2">
            Organizations often use disconnected tools for chat, recruitment, tasks, and
            file sharing, leading to fragmented workflows, duplicated effort, and slower
            decisions.
          </p>
          <TypographyH3 className="my-4 mt-8">UI/UX</TypographyH3>
          <p className="font-mono mb-2">
            Designed a clean, modern interface inspired by{" "}
            <HighlightSubskill>Material</HighlightSubskill> principles and
            productivity-focused web layouts. Built reusable components, responsive
            layouts and light/dark themes to maintain consistency across modules.
            Additonally, different preset themes and fonts are available to users to
            choose from.
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
            Centralized hiring pipeline to manage candidates, track stages, and review
            application progress from a single dashboard.
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
            Real-time team messaging with thread-based conversations to improve internal
            communication and reduce dependency on external chat tools.
          </p>
          <SlideShow
            variant="mobile-multi"
            images={[`${BASE_PATH}/employeeOS/welcome.jpg`]}
          />{" "}
          <TypographyH3 className="my-4 mt-8">Kanban</TypographyH3>
          <p className="font-mono mb-2">
            Task board for planning, assigning, and tracking work status across teams with
            clear workflow visibility.
          </p>
          <SlideShow
            variant="mobile-multi"
            images={[
              `${BASE_PATH}/employeeOS/kanban1.jpg`,
              `${BASE_PATH}/employeeOS/kanban2.jpg`,
              `${BASE_PATH}/employeeOS/kanban3.jpg`,
              `${BASE_PATH}/employeeOS/kanban4.jpg`,
            ]}
          />{" "}
          <TypographyH3 className="my-4 mt-8">File Manager</TypographyH3>
          <p className="font-mono mb-2">
            Shared workspace for uploading, organizing, and accessing files securely
            within the organization.
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
            Supports end-to-end recruitment flow: publishing openings, collecting
            applications, screening candidates, and updating hiring stages.
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
          <TypographyH3 className="my-4 mt-8">Users</TypographyH3>
          <p className="font-mono mb-2">
            Admin controls for user lifecycle management, profile visibility, and
            role-based access permissions.
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
          <TypographyP className="font-mono ">
            2DOO is a minimal yet powerful task management app designed to help users plan
            better, stay focused, and never miss deadlines. It combines clean UI with
            smart productivity features such as overdue tracking, reminders, and real-time
            task updates.
          </TypographyP>
          <ProjectsLinks repo={this.github} />

          <TypographyH3 className="my-4 ">Key Features</TypographyH3>
          <ul className="font-mono mb-2 list-disc list-inside">
            <li>Task creation and management</li>
            <li>Overdue tracking and reminders</li>
            <li>Real-time task updates</li>
            <li>Task categorization</li>
          </ul>
          <TypographyH3 className="my-4 mt-8">UI/UX</TypographyH3>
          <p className="font-mono mb-2">
            Designed a clean, modern interface inspired by{" "}
            <HighlightSubskill>Material</HighlightSubskill> principles and
            productivity-focused layouts. Built reusable components, responsive layouts
            and light/dark themes to maintain consistency across modules. Additonally,
            different preset themes and fonts are available to users to choose from.
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
          <p className="font-mono mb-2 mt-5">
            Under the hood, 2DOO is engineered using{" "}
            <HighlightSubskill>Clean Architecture</HighlightSubskill> and the{" "}
            <HighlightSubskill>BLoC</HighlightSubskill> state management pattern, ensuring
            a highly modular and maintainable codebase. The backend is powered by{" "}
            <HighlightSubskill>Supabase</HighlightSubskill>
            for secure authentication and seamless{" "}
            <HighlightSubskill>real-time</HighlightSubskill> database syncing across
            devices.
          </p>
          <p className="font-mono mb-2">
            2DOO isn&apos;t just a simple checklist; it&apos;s a production-ready
            application built to demonstrate industrial-grade{" "}
            <HighlightSkill>Flutter</HighlightSkill> development practices and efficient
            data handling.
          </p>
        </div>
      );
    },
  },
  {
    id: "newsfeed",
    category: "News App",
    title: "NewsFeed",
    src: "/assets/projects/newsfeed/home.jpg",
    screenshots: ["landing.png"],
    live: "",
    skills: {
      frontend: [PROJECT_SKILLS.flutter, PROJECT_SKILLS.dart],
      backend: [PROJECT_SKILLS.firebase, PROJECT_SKILLS.mongodb],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            The Booking Desk is your ultimate travel consultation hub, designed to turn
            your wanderlust dreams into reality. With a focus on smooth and visually
            captivating animations, navigating the site feels like a breeze—it&apos;s
            almost as if the destinations are calling you.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <p className="font-mono mb-2 mt-8">
            A sleek, modern interface greets you, featuring the latest travel tips, deals,
            and must-visit spots around the globe.
          </p>
          <TypographyH3 className="my-4 mt-8">Blogs</TypographyH3>
          <p className="font-mono mb-2">
            Dive into the curated articles written by travel experts. Whether you&apos;re
            looking for hidden gems or travel hacks, our blog section has you covered.
          </p>
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
