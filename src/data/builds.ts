import projects from "./projects";

const P = "/assets/projects";
const eos = (f: string) => `${P}/employeeOS/${f}.jpg`;
const full = (f: string) => `${P}/employeeOS/full/${f}.jpeg`; // long, scrollable page captures (phone only)
const doo = (f: string) => `${P}/2doo/full/${f}.jpeg`;

/** A tap area on a screenshot: [x, y, w, h] in % of the image; `to` opens that screenshot, or "back" closes it. */
export type Tap = {
  label: string;
  at: [number, number, number, number];
  to: string;
  replace?: true; // swap the open screen instead of stacking (a menu section opening or closing in place)
};

/**
 * EmployeeOS's app bar (menu, settings, account) on a screenshot of `w`×`h` px. The bar scales with the
 * image width, so its centre sits `cy` widths from the top.
 */
const bar = (w: number, h: number, cy = 0.077): Tap[] => {
  const y = ((cy - 0.045) * w * 100) / h;
  const bh = (0.09 * w * 100) / h;
  return [
    { label: "Open menu", at: [2, y, 12, bh], to: full("nav") },
    { label: "Settings", at: [78.5, y, 9.5, bh], to: eos("settings") },
    { label: "Account", at: [88, y, 11.5, bh], to: full("user_profile") },
  ];
};

/** 2DOO's app bar: the dashboard and task-list icons (other icons have no screenshot to open). */
const dooBar = (w: number, h: number): Tap[] => {
  const y = ((0.078 - 0.04) * w * 100) / h;
  const bh = (0.08 * w * 100) / h;
  return [
    { label: "Dashboard", at: [55.5, y, 9, bh], to: doo("dashboard") },
    { label: "All tasks", at: [66.5, y, 9, bh], to: doo("alltask_dashboard") },
  ];
};

// EmployeeOS's side menu: rows above the collapsible sections sit at the same heights in all three menu
// images (collapsed, Recruitment open, User Management open); tapping beside the drawer closes it.
const NAV = full("nav");
const NAV_REC = full("nav_rec_open");
const NAV_USER = full("nav_user_open");
const NAV_COMMON: Tap[] = [
  { label: "User", at: [4, 13, 67, 7], to: full("dashboard") }, // the overview item is the dashboard
  { label: "Hirings", at: [4, 20.5, 67, 6.5], to: full("hiring") },
  { label: "Kanban", at: [4, 32.5, 67, 7], to: eos("kanban1") },
  { label: "Chat", at: [4, 40, 67, 6.5], to: full("chat1") },
  { label: "File Manager", at: [4, 47, 67, 7], to: full("filemanager") },
  { label: "Close menu", at: [75, 0, 25, 100], to: "back" },
];

const META: Record<
  string,
  {
    tagline: string;
    color: string;
    short: string;
    screens: string[];
    taps?: Record<string, Tap[]>;
    web?: string;
    surface?: string;
    tone?: "light";
    logoBg: string;
    logoScale?: number;
    store?: string[];
    hideDots?: true;
    noSwipe?: true;
  }
> = {
  employeeOS: {
    tagline: "Hiring pipeline · Flutter",
    color: "#5b6cff",
    short: "EOS",
    hideDots: true,
    noSwipe: true,
    logoBg: "#fff",
    logoScale: 0.84,
    surface: "#fdfefd", // the screenshots' page colour, behind the status bar and home bar
    tone: "light",
    // Flutter web build copied to public/apps/employeeos (built with --base-href /apps/employeeos/).
    web: "/apps/employeeos/index.html",
    screens: [
      full("welcome"),
      full("dashboard"),
      full("hiring"),
      full("job_posting"),
      full("job_application"),
      full("interview_scheduling"),
      eos("kanban1"),
      full("chat1"),
      full("filemanager"),
      full("user_profile"),
    ],
    taps: {
      [full("welcome")]: [{ label: "Sign in", at: [75, 1, 21.5, 4], to: eos("sigin_page") }],
      [eos("sigin_page")]: [
        { label: "Back", at: [2, 2, 14, 5], to: "back" },
        { label: "Sign in", at: [4, 50.5, 92, 7.5], to: full("dashboard") },
      ],
      [full("dashboard")]: bar(324, 1598),
      [full("hiring")]: [...bar(302, 1421), { label: "Interview progress", at: [51, 67.6, 35, 2.1], to: full("interview_scheduling") }],
      [full("job_posting")]: [
        ...bar(338, 1599),
        { label: "Add posting", at: [61.5, 4.7, 34, 2.4], to: full("add_job_posting") },
        // each card's "N applications" link
        ...[24.9, 45.6, 66.2, 86.9].map((y): Tap => ({ label: "Applications", at: [37, y, 42, 1.8], to: full("job_application") })),
      ],
      [full("add_job_posting")]: [...bar(282, 1602), { label: "Back", at: [3, 3.3, 10, 1.8], to: "back" }],
      [full("job_application")]: bar(386, 1598),
      [full("interview_scheduling")]: bar(442, 1601),
      [eos("kanban1")]: bar(1080, 2206, 0.08),
      [full("chat1")]: [...bar(642, 1552, 0.094), { label: "Open chat with David Kim", at: [3, 36, 94, 6.2], to: full("chat2") }],
      [full("chat2")]: [...bar(674, 1548, 0.094), { label: "Back", at: [2, 9.6, 8, 3.2], to: "back" }],
      [full("filemanager")]: bar(434, 1602),
      [full("user_profile")]: bar(666, 1601),
      [full("user_account")]: bar(462, 1601),
      [NAV]: [
        ...NAV_COMMON,
        { label: "Recruitment", at: [4, 55.3, 67, 5.2], to: NAV_REC, replace: true },
        { label: "User Management", at: [4, 62, 67, 9], to: NAV_USER, replace: true },
      ],
      [NAV_REC]: [
        ...NAV_COMMON,
        { label: "Recruitment", at: [4, 54.8, 67, 6.2], to: NAV, replace: true }, // collapse
        { label: "Job Posting", at: [13, 62.6, 58, 4], to: full("job_posting") },
        { label: "Job Application", at: [13, 68.9, 58, 4], to: full("job_application") },
        { label: "Interview Scheduling", at: [13, 75, 58, 4], to: full("interview_scheduling") },
        { label: "User Management", at: [4, 81, 67, 8], to: NAV_USER, replace: true },
      ],
      [NAV_USER]: [
        ...NAV_COMMON,
        { label: "Recruitment", at: [4, 55.3, 67, 5.2], to: NAV_REC, replace: true },
        { label: "User Management", at: [4, 62, 67, 9], to: NAV, replace: true }, // collapse
        { label: "Account", at: [13, 72.6, 58, 4], to: full("user_account") },
        { label: "Profile", at: [13, 79, 58, 4], to: full("user_profile") },
      ],
      [eos("settings")]: [
        { label: "Close settings", at: [84, 1, 13, 6], to: "back" },
        { label: "Close settings", at: [0, 8, 14, 92], to: "back" },
      ],
    },
  },
  "2doo": {
    tagline: "Task manager · On Google Play",
    color: "#f0a43a",
    short: "2DO",
    hideDots: true,
    noSwipe: true,
    logoBg: "#fff",
    logoScale: 0.86,
    surface: "#fdfdfd",
    tone: "light",
    screens: [
      doo("welcome"),
      doo("dashboard"),
      doo("alltask_dashboard"),
      doo("alltask_dashboard_cardview"),
      doo("weekly_chart"),
      doo("monthly_overview"),
    ],
    taps: {
      [doo("welcome")]: [
        { label: "Sign in", at: [73, 0.6, 23, 2.6], to: doo("signin_page") },
        { label: "Get started", at: [3, 96.2, 94, 3.2], to: doo("signin_page") },
      ],
      [doo("signin_page")]: [
        { label: "Back", at: [1.5, 1.2, 13, 5], to: "back" },
        { label: "Sign in", at: [4, 53.5, 92, 7], to: doo("dashboard") },
      ],
      [doo("dashboard")]: [
        ...dooBar(338, 1596),
        { label: "Add task", at: [6, 19, 88, 3], to: doo("create_new_task") },
        { label: "Tasks on 1 October", at: [44, 78.1, 12, 2.8], to: doo("monthly_overview") },
      ],
      [doo("alltask_dashboard")]: [
        ...dooBar(496, 1602),
        { label: "Add task", at: [6, 14.6, 88, 4], to: doo("create_new_task") },
        { label: "Card view", at: [82.5, 10.6, 8, 2.8], to: doo("alltask_dashboard_cardview") },
      ],
      [doo("alltask_dashboard_cardview")]: [
        ...dooBar(788, 1599),
        { label: "Add task", at: [6, 23.1, 88, 6.7], to: doo("create_new_task") },
        { label: "List view", at: [83, 17.3, 7.5, 3.3], to: doo("alltask_dashboard") },
      ],
      [doo("weekly_chart")]: [...dooBar(788, 1599), { label: "Month view", at: [76, 11.5, 16, 4.3], to: doo("monthly_overview") }],
      [doo("monthly_overview")]: [
        ...dooBar(788, 1599),
        { label: "Week view", at: [58, 13.5, 16, 4.5], to: doo("weekly_chart") },
        { label: "Close", at: [79, 49.8, 6, 3.2], to: "back" },
      ],
      [doo("create_new_task")]: [
        { label: "Close", at: [80, 10.5, 10, 3.7], to: "back" },
        { label: "Cancel", at: [34, 84, 21, 6], to: "back" },
        { label: "Create task", at: [58, 84, 32, 6], to: "back" },
      ],
    },
    // the Play Store screen shows store-style mockups rather than the long page captures
    store: [1, 2, 3, 4, 5].map((n) => encodeURI(`${P}/2doo/Samsung Galaxy S21 Ultra Screenshot ${n}.png`)),
  },
  newsfeed: {
    tagline: "News reader · Flutter",
    color: "#ff4d6d",
    short: "NF",
    logoBg: "#000",
    logoScale: 1.9, // the file is an icon with a wide transparent margin: zoom it to fill the tile
    screens: ["home", "home_filter", "detail", "profile"].map((f) => `${P}/newsfeed/${f}.jpg`),
  },
};

export type Build = {
  id: string;
  title: string;
  category: string;
  tagline: string;
  color: string;
  short: string;
  logo: string; // public/assets/projects/<id>/logo.png
  logoBg: string; // tile colour behind the logo
  logoScale?: number; // logo size in its tile (1 = fill)
  store?: string[]; // Play Store listing screenshots (defaults to `screens`)
  hideDots?: true; // no page dots under the screenshots
  noSwipe?: true; // no sideways paging: screens are reached by their tap areas only
  screens: string[];
  taps?: Record<string, Tap[]>; // tap areas per screenshot url
  web?: string; // a Flutter web build to run live on the phone; screenshots stay as the fallback
  // Screenshots are bare app pages: lay them out in safe areas on this page colour. Without it they're
  // full-device captures (own status bar and nav) and run edge to edge.
  surface?: string;
  tone?: "light"; // light screenshots: dark status bar and controls
  href: string;
  github?: string;
  live?: string;
};

export const BUILDS: Build[] = projects.map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  logo: `${P}/${p.id}/logo.png`,
  href: `/projects/${p.id}`,
  github: p.github?.replace(/\.git$/, ""),
  live: p.live || undefined,
  ...(META[p.id] ?? {
    tagline: p.category,
    color: "#54c5f8",
    short: p.title.slice(0, 3).toUpperCase(),
    logoBg: "#fff",
    screens: [],
  }),
}));
