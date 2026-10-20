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
  // From the CV (Jake_s_Resume__Anonymous_-3.pdf, Oct 2026). Phone number deliberately left out of the site.
  about: {
    overview:
      "Dedicated Mobile Application Developer with strong Dart fundamentals. Specialized in Clean Architecture and BLoC for robust state management. Experienced in the full development lifecycle, including CI/CD integration, performance tuning for high-traffic apps, and seamless database synchronization.",
    role: "Flutter Developer, Android Developer",
    location: "Greater Noida, Uttar Pradesh",
    education: "B.Tech in Computer Science, Bennett University (Sep 2022 – May 2026)",
    languages: "Dart, Kotlin, Python, C++",
    stateManagement: "BLoC, Cubit, Riverpod",
  },
  email: "nautiyalyash4@gmail.com",
  site: "",
  resume: "https://drive.google.com/file/d/17ZU4ynaAr4SyoAedPkeFUgsxuLoRF_dF/view?usp=sharing",
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
