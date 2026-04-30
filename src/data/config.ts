const config = {
  title: "Yash Nautiyal | Flutter Developer",
  description: {
    long: "A Flutter developer and creative technologist specializing in interactive web experiences, 3D animations, and innovative projects. Discover my latest work, including Coding Ducks, The Booking Desk, Ghostchat, and more. Let's build something amazing together!",
    short:
      "Flutter developer creating interactive mobile applications and innovative projects.",
  },
  keywords: [
    "flutter developer",
    "creative technologist",
    "Android development",
    "Flutter",
    "Dart",
    "Android",
    "iOS",
    "Supabase",
    "Firebase",
    "REST API",
    "Bloc",
    "Provider",
    "State Management",
  ],
  author: "Yash Nautiyal",
  email: "nautiyalyash4@gmail.com",
  site: "",
  resume: "https://drive.google.com/file/d/1o-_LEGlwnB2dkCCb23cRAeG1tdKxgUDE/view?usp=sharing",
  get ogImg() {
    return this.site + "/assets/seo/og-image.svg";
  },
  social: {
    gmail:{link: "mailto:nautiyalyash4@gmail.com", img: "https://img.icons8.com/fluency/48/gmail-new.png"},
    linkedin:{link: "https://www.linkedin.com/in/yash-nautiyal-35558a256/", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg"},
    github: {link:"https://github.com/Yash-Nautiyal", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"},
  },
};
export { config };
