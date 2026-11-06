import { AboutSection } from "./components/about/AboutSection";
import { SignalParticles } from "./components/background/SignalParticles";
import { ContactSection } from "./components/contact/ContactSection";
import { Hero } from "./components/hero/Hero";
import { SiteNav } from "./components/hero/SiteNav";
import { SiteFooter } from "./components/layout/SiteFooter";
import { ProjectsSection } from "./components/projects/ProjectsSection";
import { SkillsSection } from "./components/skills/SkillsSection";
import { useRevealAll } from "./hooks/useRevealAll";
import { useSpotlight } from "./hooks/useSpotlight";
import { useEffect } from "react";
import { profile } from "./data/profile";
import { listenForCvClicks } from "./lib/analytics";
import { useTheme } from "./theme/context";

/** Only this small component re-renders when the theme changes, not the whole page. */
function Background() {
  const { theme } = useTheme();
  return <SignalParticles mode={theme} />;
}

export function App() {
  useRevealAll();
  useSpotlight();
  useEffect(() => listenForCvClicks(profile.cv), []);
  return (
    <>
      <Background />
      <SiteNav />
      <main className="relative z-10">
        <Hero />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </>
  );
}
