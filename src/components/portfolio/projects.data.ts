import hhHero from "@/assets/projects/havenharmony/hero.jpg";
import hhDashboard from "@/assets/projects/havenharmony/dashboard.png";
import hhRooms from "@/assets/projects/havenharmony/rooms.jpg";

import swCharts from "@/assets/projects/savvywallet/chart.png";
import swLogin from "@/assets/projects/savvywallet/login.png";
import swTransactions from "@/assets/projects/savvywallet/entry.png";

import anHero from "@/assets/projects/aniverse/hero.jpg";
import anGenres from "@/assets/projects/aniverse/genres.png";
import anTrending from "@/assets/projects/aniverse/trending.jpg";

import tmHome from "@/assets/projects/taskorbit-mobile/m1.jpg";
import tmTasks from "@/assets/projects/taskorbit-mobile/m2.jpg";
import tmInsights from "@/assets/projects/taskorbit-mobile/m3.jpg";
import plPricing from "@/assets/projects/paylance/paylance3.png";
import plInventory from "@/assets/projects/paylance/paylance2.png";
import plInvoice from "@/assets/projects/paylance/paylance1.png";

import sfHero from "@/assets/projects/sulitflight/sulitflight1.jpg";
import sfResults from "@/assets/projects/sulitflight/sulitflight2.png";
import sfFilters from "@/assets/projects/sulitflight/sulitflight3.png";
import mfOverview from "@/assets/projects/mineflow/mineflow1.png";
import mfBoards from "@/assets/projects/mineflow/mineflow2.png";
import mfAnalytics from "@/assets/projects/mineflow/mineflow3.png";
import afDashboard from "@/assets/projects/adforge/adforge1.jpg";
import afCampaigns from "@/assets/projects/adforge/adforge2.png";
import afInsights from "@/assets/projects/adforge/adforge3.png";
import spHome from "@/assets/projects/servicepass/servicepass1.png";
import spStudy from "@/assets/projects/servicepass/servicepass2.png";
import spMockExam from "@/assets/projects/servicepass/servicepass3.png";
import ppDashboard from "@/assets/projects/presyopro/presyopro1.png";
import ppCalculator from "@/assets/projects/presyopro/presyopro2.png";
import ppBreakdown from "@/assets/projects/presyopro/presyopro3.png";
import pdOverview from "@/assets/projects/procuredesk/procuredesk1.png";
import pdWorkflow from "@/assets/projects/procuredesk/procuredesk2.png";
import pdAudit from "@/assets/projects/procuredesk/procuredesk3.png.png";
import cqOverview from "@/assets/projects/cliniqo/cliniqo1.png";
import cqQueue from "@/assets/projects/cliniqo/cliniqo2.png";
import cqConsultation from "@/assets/projects/cliniqo/cliniqo3.png.png";
import tpOverview from "@/assets/projects/timepay/timepay1.png";
import tpAttendance from "@/assets/projects/timepay/timepay2.png.png";
import tpPayroll from "@/assets/projects/timepay/timepay3.png.png";
import pmOverview from "@/assets/projects/paymatrix/paymatrix1.png";
import pmImport from "@/assets/projects/paymatrix/paymatrix2.png.png";
import pmResults from "@/assets/projects/paymatrix/paymatrix3.png.png";
import nmPanelWide from "@/assets/projects/notchmeter/notchmeter1.jpg";
import nmPanelDetail from "@/assets/projects/notchmeter/notchmeter2.jpg";
import nmPill from "@/assets/projects/notchmeter/notchmeter3.jpg";

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
  /** Problem space, derived from the description (Fintech, Payroll, …). */
  domain: string;
  /** Two–three capabilities lifted verbatim-ish from the description. */
  highlights: string[];
}

export interface WebProject extends BaseProject {
  kind: "web";
  images: ProjectScreenshot[];
  liveUrl?: string;
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
    title: "NotchMeter",
    description:
      "A Dynamic-Island-style overlay that lives in the MacBook notch and shows how much of each AI subscription has been burned — Claude, ChatGPT, and Cursor usage at a glance, with per-window usage bars, reset countdowns, plan badges, and credit balances.",
    kind: "web",
    featured: true,
    domain: "Developer Tools",
    highlights: [
      "Collapsed pill shows the most-consumed provider",
      "Hover expands per-provider usage bars & reset countdowns",
      "Polls Claude, ChatGPT & Cursor every 60s",
    ],
    images: [
      {
        src: nmPanelWide,
        alt: "NotchMeter expanded panel in the macOS menu bar showing Claude, ChatGPT, and Cursor usage",
      },
      {
        src: nmPanelDetail,
        alt: "NotchMeter usage panel with plan badges, credit balances, and reset countdowns",
      },
      {
        src: nmPill,
        alt: "NotchMeter collapsed notch pill showing Cursor at 88 percent",
      },
    ],
    repoUrl: "https://github.com/Ydde21/NotchMeter",
  },
  {
    title: "SaveWise",
    description:
      "A financial tracker app that helps users monitor income, expenses, savings, and loans with clear dashboards and actionable insights.",
    kind: "mobile",
    featured: true,
    domain: "Fintech",
    highlights: [
      "Income, expenses, savings & loan tracking",
      "Dashboards with actionable insights",
      "Shipped to iOS and Android",
    ],
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
    domain: "Hospitality",
    highlights: [
      "Booking & room management",
      "Guest services features",
      "Built for hospitality operations",
    ],
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
    domain: "Business Ops",
    highlights: [
      "Client billing & invoicing",
      "Inventory tracking",
      "PDF invoice workflows",
    ],
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
    title: "ProcureDesk",
    description:
      "A full-cycle Purchase Request and Budget Control System that streamlines procurement from draft to delivery through role-based approvals, budget reservation/release, PO creation, and immutable audit logs.",
    kind: "web",
    domain: "Procurement",
    highlights: [
      "Role-based approvals, draft to delivery",
      "Budget reservation & release",
      "PO creation with immutable audit logs",
    ],
    images: [
      { src: pdOverview, alt: "ProcureDesk dashboard and request overview" },
      { src: pdWorkflow, alt: "ProcureDesk approval workflow and queue view" },
      { src: pdAudit, alt: "ProcureDesk audit trail and budget tracking view" },
    ],
    liveUrl: "https://procuredesk.lovable.app/",
  },
  {
    title: "Cliniqo",
    description:
      "A full-stack Clinic Booking and Queue Management System that streamlines patient registration, appointment scheduling, walk-in handling, check-in, and real-time queue monitoring. It includes secure role-based access (Admin, Receptionist, Doctor, Patient), doctor consultation workflows, automated appointment reminders, analytics reports, and audit logs to improve clinic operations and reduce patient wait times.",
    kind: "web",
    domain: "Healthcare",
    highlights: [
      "Registration, scheduling & walk-in check-in",
      "Real-time queue monitoring",
      "Role-based access — Admin to Patient",
    ],
    images: [
      { src: cqOverview, alt: "Cliniqo clinic dashboard and activity overview" },
      { src: cqQueue, alt: "Cliniqo patient queue and check-in management view" },
      {
        src: cqConsultation,
        alt: "Cliniqo consultation records and appointment workflow",
      },
    ],
    liveUrl: "https://cliniqo.lovable.app/",
  },
  {
    title: "TimePay PH",
    description:
      "A mobile-first SaaS attendance and payroll platform built for Philippine businesses, designed to unify workforce operations in one secure system. It combines role-based employee management, geofenced clock-in/out, and attendance analytics with a phased path to fully compliant payroll processing, government contributions, tax calculations, payslips, and audit-ready controls.",
    kind: "web",
    domain: "Payroll",
    highlights: [
      "Geofenced clock-in/out & analytics",
      "Government contributions & tax calculations",
      "Payslips with audit-ready controls",
    ],
    images: [
      { src: tpOverview, alt: "TimePay PH dashboard and workforce overview" },
      {
        src: tpAttendance,
        alt: "TimePay PH attendance and geofencing clock in workflow",
      },
      { src: tpPayroll, alt: "TimePay PH payroll and compliance reporting view" },
    ],
    liveUrl: "https://timepay-ph.vercel.app/",
  },
  {
    title: "PayMatrix",
    description:
      "PayMatrix is a modern Philippine payroll system focused on accurate, compliance-ready payroll processing with biometric attendance import. It supports fingerprint log uploads (including ZKTeco and generic CSV), intelligent column mapping and punch pairing, then computes end-to-end payroll with SSS, PhilHealth, Pag-IBIG, TRAIN withholding tax, overtime/holiday pay, allowances, deductions, and exportable payroll results in a clean, role-ready web interface.",
    kind: "web",
    domain: "Payroll",
    highlights: [
      "Biometric import — ZKTeco & CSV",
      "SSS, PhilHealth, Pag-IBIG & TRAIN tax",
      "Overtime, holiday pay & deductions",
    ],
    images: [
      { src: pmOverview, alt: "PayMatrix payroll dashboard overview" },
      {
        src: pmImport,
        alt: "PayMatrix biometric attendance import and column mapping",
      },
      { src: pmResults, alt: "PayMatrix payroll computation and results view" },
    ],
    liveUrl: "https://paymatrix.lovable.app/",
  },
  {
    title: "SulitFlights",
    description:
      "A flight search web app focused on helping users find the cheapest available flight options quickly.",
    kind: "web",
    domain: "Travel",
    highlights: [
      "Cheapest-first flight search",
      "Results, pricing & filters",
    ],
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
    domain: "Automation",
    highlights: [
      "Comment keyword detection",
      "Automated Messenger DMs",
      "Transaction flow to completion",
    ],
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
    domain: "Ad Tech",
    highlights: [
      "Creative building",
      "Campaign launching",
      "Performance insights",
    ],
    images: [
      { src: afDashboard, alt: "AdForge campaign dashboard overview" },
      { src: afCampaigns, alt: "AdForge active campaigns management screen" },
      { src: afInsights, alt: "AdForge analytics and ad performance insights" },
    ],
    liveUrl: "https://adforge-demo.lovable.app/app",
  },
  {
    title: "ServicePass PH",
    description:
      "A Civil Service Exam simulator with Study Mode and a timed Mock Exam experience modeled after the real CSE flow. Includes PayMongo payment gateway integration in test mode while business verification is pending.",
    kind: "web",
    domain: "Education",
    highlights: [
      "Study Mode & timed Mock Exam",
      "Modeled after the real CSE flow",
      "PayMongo payments, test mode",
    ],
    images: [
      { src: spHome, alt: "ServicePass PH exam simulator landing screen" },
      { src: spStudy, alt: "ServicePass PH study mode reviewer interface" },
      {
        src: spMockExam,
        alt: "ServicePass PH mock exam interface with timed questions",
      },
    ],
    liveUrl: "https://servicepassph.vercel.app/",
  },
  {
    title: "Presyo Pro Calculator",
    description:
      "A pricing and profit-margin calculator for online sellers that estimates the right selling price based on costs, fees, and target profit so they can stay competitive without losing money.",
    kind: "web",
    domain: "E-commerce",
    highlights: [
      "Selling-price estimation from costs & fees",
      "Target profit-margin calculation",
    ],
    images: [
      { src: ppDashboard, alt: "Presyo Pro Calculator dashboard overview" },
      { src: ppCalculator, alt: "Presyo Pro product pricing calculator" },
      { src: ppBreakdown, alt: "Presyo Pro cost and profit breakdown view" },
    ],
    liveUrl: "https://presyopro.sticklight.app/",
  },
  {
    title: "Savvy Wallet",
    description:
      "A smart finance and expense tracker that helps users manage budgets, track spending, and visualize financial goals with intuitive charts.",
    kind: "web",
    domain: "Fintech",
    highlights: [
      "Budget management & spending tracking",
      "Financial-goal charts",
    ],
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
    domain: "Community",
    highlights: [
      "Showcase, share & discover artwork",
      "Galleries & community interactions",
      "Curated collections",
    ],
    images: [
      { src: anHero, alt: "Aniverse Canvas hero artwork section" },
      { src: anGenres, alt: "Aniverse Canvas genre explorer" },
      { src: anTrending, alt: "Aniverse Canvas trending gallery" },
    ],
    liveUrl: "https://aniverse-canvas.lovable.app",
  },
];
