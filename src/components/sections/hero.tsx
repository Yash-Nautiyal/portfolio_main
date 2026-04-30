import { config } from "@/data/config";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="home" className="relative scroll-mt-28 py-16 sm:py-24 lg:min-h-[78vh]">
      <div className="hero-inner-grid">
        <div className="relative z-10">
          <div className="hero-badge">Available for work</div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-500">
            Flutter / Android Developer
          </p>
          <h1 className="hero-name-gradient mt-3 pb-3 text-4xl leading-[1.2] font-extrabold tracking-tight sm:text-6xl sm:leading-[1.1]">
            {config.author}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {config.description.short}
          </p>
          <div className="mt-8 flex flex-col gap-3 w-fit">
            <Button href={config.resume} variant="accent" className="rounded-xl w-full">
              Resume
            </Button>
            <div className="flex flex-wrap gap-3">
              <Button href="#projects">View Projects</Button>
              <Button href="#contact" variant="secondary">
                Contact Me
              </Button>
            </div>
          </div>
          {/* <div className="mt-10 flex gap-8 border-t border-zinc-200/70 pt-6 dark:border-zinc-800">
            <div>
              <p className="text-2xl font-extrabold">3+</p>
              <p className="text-xs text-zinc-500">Years exp.</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold">20+</p>
              <p className="text-xs text-zinc-500">Apps shipped</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold">10k+</p>
              <p className="text-xs text-zinc-500">Users reached</p>
            </div>
          </div> */}
        </div>

        <div className="hero-visual hidden lg:flex">
          <div className="hero-ring ring1" />
          <div className="hero-ring ring2" />
          <div className="phone-frame-hero">
            <div className="phone-screen-hero">
              <div className="phone-bar accent" />
              <div className="phone-bar w-[45%]" />
              <div className="phone-card-hero">
                <div className="phone-dot-row">
                  <div className="phone-dot a" />
                  <div className="phone-dot b" />
                  <div className="phone-dot c" />
                </div>
                <div className="phone-mini-bar" />
                <div className="phone-mini-bar" />
                <div className="phone-mini-bar" />
              </div>
              <div className="phone-bar accent2" />
              <div className="phone-bar w-[80%]" />
              <div className="phone-card-hero">
                <div className="phone-dot-row">
                  <div className="phone-dot b" />
                  <div className="phone-dot a" />
                </div>
                <div className="phone-mini-bar" />
                <div className="phone-mini-bar" />
              </div>
              <div className="phone-bar w-[55%]" />
              <div className="phone-bar accent w-[35%]" />
            </div>
          </div>
          <div className="hero-chip chip1">Flutter 3.x</div>
          <div className="hero-chip chip2">Kotlin - Jetpack</div>
          <div className="hero-chip chip3">Firebase</div>
        </div>
      </div>
    </section>
  );
}
