import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import TechMarquee from "@/components/portfolio/TechMarquee";
import TechStackSection from "@/components/portfolio/TechStackSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import ChatbotSection from "@/components/portfolio/ChatbotSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <TechMarquee />
        <TechStackSection />
        <ProjectsSection />
        <ChatbotSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
