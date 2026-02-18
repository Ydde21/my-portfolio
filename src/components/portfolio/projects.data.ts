import hhHero from "@/assets/projects/havenharmony/hero.png";
import hhDashboard from "@/assets/projects/havenharmony/dashboard.png";
import hhRooms from "@/assets/projects/havenharmony/rooms.png";

import swCharts from "@/assets/projects/savvywallet/chart.png";
import swLogin from "@/assets/projects/savvywallet/login.png";
import swTransactions from "@/assets/projects/savvywallet/entry.png";

import anHero from "@/assets/projects/aniverse/hero.png";
import anGenres from "@/assets/projects/aniverse/genres.png";
import anTrending from "@/assets/projects/aniverse/trending.png";

import tmHome from "@/assets/projects/taskorbit-mobile/home.png";
import tmTasks from "@/assets/projects/taskorbit-mobile/tasks.png";
import tmInsights from "@/assets/projects/taskorbit-mobile/insights.png";

export type ProjectKind = "web" | "mobile";

export interface ProjectScreenshot {
  src: string;
  alt: string;
}

export interface ProjectLinkSet {
  appStore?: string;
  googlePlay?: string;
}

interface BaseProject {
  title: string;
  description: string;
  kind: ProjectKind;
  featured?: boolean;
  tech: string[];
}

export interface WebProject extends BaseProject {
  kind: "web";
  images: ProjectScreenshot[];
  liveUrl: string;
  repoUrl?: string;
}

export interface MobileProject extends BaseProject {
  kind: "mobile";
  platforms: Array<"iOS" | "Android">;
  screenshots: ProjectScreenshot[];
  storeLinks: ProjectLinkSet;
  caseStudyUrl: string;
}

export type PortfolioProject = WebProject | MobileProject;

export const projects: PortfolioProject[] = [
  {
    title: "TaskOrbit Mobile",
    description:
      "A productivity app focused on habit tracking, daily planning, and progress insights with a clean, distraction-free mobile experience.",
    kind: "mobile",
    featured: true,
    platforms: ["iOS", "Android"],
    screenshots: [
      { src: tmHome, alt: "TaskOrbit mobile home dashboard" },
      { src: tmTasks, alt: "TaskOrbit mobile task planning view" },
      { src: tmInsights, alt: "TaskOrbit mobile analytics and insights screen" },
    ],
    storeLinks: {
      appStore: "https://apps.apple.com/us/genre/ios-productivity/id6007",
      googlePlay: "https://play.google.com/store/apps/category/PRODUCTIVITY",
    },
    caseStudyUrl: "https://savvy-wallet.lovable.app",
    tech: ["React Native", "Expo", "TypeScript", "Firebase"],
  },
  {
    title: "Haven Harmony",
    description:
      "A comprehensive hotel management system with booking, room management, and guest services features. Built for seamless hospitality operations.",
    kind: "web",
    images: [
      { src: hhHero, alt: "Haven Harmony landing page" },
      { src: hhDashboard, alt: "Haven Harmony management dashboard" },
      { src: hhRooms, alt: "Haven Harmony rooms management interface" },
    ],
    liveUrl: "https://havenharmony.lovable.app",
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
  },
  {
    title: "Savvy Wallet",
    description:
      "A smart finance and expense tracker that helps users manage budgets, track spending, and visualize financial goals with intuitive charts.",
    kind: "web",
    images: [
      { src: swCharts, alt: "Savvy Wallet financial chart view" },
      { src: swLogin, alt: "Savvy Wallet login screen" },
      { src: swTransactions, alt: "Savvy Wallet transaction entry form" },
    ],
    liveUrl: "https://savvy-wallet.lovable.app",
    tech: ["React", "TypeScript", "Recharts", "Tailwind"],
  },
  {
    title: "Aniverse Canvas",
    description:
      "An anime art platform where artists can showcase, share, and discover artwork. Features galleries, community interactions, and curated collections.",
    kind: "web",
    images: [
      { src: anHero, alt: "Aniverse Canvas hero artwork section" },
      { src: anGenres, alt: "Aniverse Canvas genre explorer" },
      { src: anTrending, alt: "Aniverse Canvas trending gallery" },
    ],
    liveUrl: "https://aniverse-canvas.lovable.app",
    tech: ["React", "TypeScript", "Framer Motion", "Supabase"],
  },
];
