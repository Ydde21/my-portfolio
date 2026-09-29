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
import Preloader from "@/components/portfolio/Preloader";

/* The 3D scene is owned by src/scene/** — mounted once, fixed behind all
   content; sections opt into choreography via `data-scene` attributes. */
const ExperienceCanvas = lazy(() => import("@/scene/ExperienceCanvas"));

const Index = () => {
  return (
    <div className="grain min-h-screen bg-background text-foreground">
      <Preloader />

      {/* Scene mount — behind content, never intercepts input */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <Suspense fallback={null}>
          <ExperienceCanvas />
        </Suspense>
      </div>

      <Navbar />

      <div className="relative z-10">
        <main>
          <HeroSection />
          <WorkSection />
          <CapabilitiesSection />
          <AboutSection />
          <StackSection />
          <ContactSection />
        </main>
        <Footer />
      </div>

      <ChatbotSection />
    </div>
  );
};

export default Index;
