import hhHero from "@/assets/projects/havenharmony/hero.png";
import hhDashboard from "@/assets/projects/havenharmony/dashboard.png";
import hhRooms from "@/assets/projects/havenharmony/rooms.png";

import swCharts from "@/assets/projects/savvywallet/chart.png";
import swLogin from "@/assets/projects/savvywallet/login.png";
import swTransactions from "@/assets/projects/savvywallet/entry.png";

import anHero from "@/assets/projects/aniverse/hero.png";
import anGenres from "@/assets/projects/aniverse/genres.png";
import anTrending from "@/assets/projects/aniverse/trending.png";

import tmHome from "@/assets/projects/taskorbit-mobile/m1.jpg";
import tmTasks from "@/assets/projects/taskorbit-mobile/m2.jpg";
import tmInsights from "@/assets/projects/taskorbit-mobile/m3.jpg";
import plPricing from "@/assets/projects/paylance/paylance3.png";
import plInventory from "@/assets/projects/paylance/paylance2.png";
import plInvoice from "@/assets/projects/paylance/paylance1.png";

import sfHero from "@/assets/projects/sulitflight/sulitflight1.png";
import sfResults from "@/assets/projects/sulitflight/sulitflight2.png";
import sfFilters from "@/assets/projects/sulitflight/sulitflight3.png";
import mfOverview from "@/assets/projects/mineflow/mineflow1.png";
import mfBoards from "@/assets/projects/mineflow/mineflow2.png";
import mfAnalytics from "@/assets/projects/mineflow/mineflow3.png";
import afDashboard from "@/assets/projects/adforge/adforge1.png";
import afCampaigns from "@/assets/projects/adforge/adforge2.png";
import afInsights from "@/assets/projects/adforge/adforge3.png";

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
  downloadUrl: string;
  caseStudyUrl: string;
}

export type PortfolioProject = WebProject | MobileProject;

export const projects: PortfolioProject[] = [
  {
    title: "SaveWise",
    description:
      "A financial tracker app that helps users monitor income, expenses, savings, and loans with clear dashboards and actionable insights.",
    kind: "mobile",
    featured: true,
    platforms: ["iOS", "Android"],
    screenshots: [
      { src: tmHome, alt: "SaveWise mobile home dashboard" },
      { src: tmTasks, alt: "SaveWise mobile task planning view" },
      {
        src: tmInsights,
        alt: "SaveWise mobile analytics and insights screen",
      },
    ],
    storeLinks: {
      appStore: "https://apps.apple.com/us/genre/ios-productivity/id6007",
      googlePlay: "https://play.google.com/store/apps/category/PRODUCTIVITY",
    },
    downloadUrl: "https://github.com/Ydde21/SaveWise/releases/tag/SaveWise",
    caseStudyUrl: "https://savvy-wallet.lovable.app",
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
  },
  {
    title: "Paylance",
    description:
      "An all-in-one invoicing and business operations platform with client billing, inventory tracking, and PDF invoice workflows.",
    kind: "web",
    images: [
      {
        src: plPricing,
        alt: "Paylance billing plans and subscription overview",
      },
      {
        src: plInventory,
        alt: "Paylance inventory dashboard with stock levels",
      },
      { src: plInvoice, alt: "Paylance invoice preview and PDF export" },
    ],
    liveUrl: "https://paylance.lovable.app",
  },
  {
    title: "SulitFlights",
    description:
      "A flight search web app focused on helping users find the cheapest available flight options quickly.",
    kind: "web",
    images: [
      { src: sfHero, alt: "SulitFlights search page for flight deals" },
      { src: sfResults, alt: "SulitFlights flight results and pricing list" },
      { src: sfFilters, alt: "SulitFlights filters for cheaper flights" },
    ],
    liveUrl: "https://sulitflights.sticklight.app/",
  },
  {
    title: "Mine Flow",
    description:
      "An auto-reply system for Facebook live sellers that detects comment keywords, sends automated Messenger DMs, and continues the transaction flow until completion.",
    kind: "web",
    images: [
      { src: mfOverview, alt: "Mine Flow overview dashboard" },
      { src: mfBoards, alt: "Mine Flow project board and task management" },
      { src: mfAnalytics, alt: "Mine Flow analytics and progress insights" },
    ],
    liveUrl: "https://mineflow.lovable.app",
  },
  {
    title: "AdForge",
    description:
      "An ad campaign management web app for building creatives, launching campaigns, and monitoring performance insights.",
    kind: "web",
    images: [
      { src: afDashboard, alt: "AdForge campaign dashboard overview" },
      { src: afCampaigns, alt: "AdForge active campaigns management screen" },
      { src: afInsights, alt: "AdForge analytics and ad performance insights" },
    ],
    liveUrl: "https://adforge-demo.lovable.app/app",
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
  },
];
