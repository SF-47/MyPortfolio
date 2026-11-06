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

export function App() {
  const { theme } = useTheme();
  useRevealAll();
  useSpotlight();
  useEffect(() => listenForCvClicks(profile.cv), []);
  return (
    <>
      <SignalParticles mode={theme} />
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
