import { useReducedMotion } from "@/hooks/useMediaQuery";
import { MotionConfig } from "framer-motion";
import { Suspense, lazy } from "react";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import WorkSection from "@/components/portfolio/WorkSection";
import CapabilitiesSection from "@/components/portfolio/CapabilitiesSection";
import AboutSection from "@/components/portfolio/AboutSection";
import StackSection from "@/components/portfolio/StackSection";
import ChatbotSection from "@/components/portfolio/ChatbotSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";

/* One canvas renders into reserved HTML anchors, above section surfaces and
   below navigation and dialogs. Pointer interaction comes from HTML controls. */
const ExperienceCanvas = lazy(() => import("@/scene/ExperienceCanvas"));

const Index = () => {
  const reduced = useReducedMotion();
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <div className="grain min-h-screen bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        {/* Scene mount — transparent and never intercepts input */}
        <div
          className="pointer-events-none fixed inset-0 z-20"
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <ExperienceCanvas />
          </Suspense>
        </div>

        <Navbar />

        <div className="relative z-10">
          <main id="main-content">
            <HeroSection />
            <WorkSection />
            <AboutSection />
            <CapabilitiesSection />
            <StackSection />
            <ContactSection />
          </main>
          <Footer />
        </div>

        <ChatbotSection />
      </div>
    </MotionConfig>
  );
};

export default Index;
