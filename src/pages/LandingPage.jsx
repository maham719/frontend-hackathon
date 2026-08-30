import React, { useEffect, useMemo, useState } from "react";
import {Link} from "react-router-dom"
import {
  Activity,
  ArrowRight,
  BarChart3,
  BellRing,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDashed,
  Clock3,
  FileText,
  Gauge,
  Layers3,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Users,
  Wand2,
  Workflow,
  X,
} from "lucide-react";
import Themetogglebutton from "../components/Themetogglebutton";
import { useTheme } from "../context/ThemeContext.jsx";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI Triage", href: "#ai-triage" },
  { label: "Features", href: "#features" },
];

const workflowSteps = [
  {
    title: "Customer submits ticket",
    description: "Issues arrive with rich context and customer history.",
    icon: Ticket,
  },
  {
    title: "AI analyzes",
    description: "The system reads the issue, detects intent, and scores urgency.",
    icon: BrainCircuit,
  },
  {
    title: "Agent reviews",
    description: "Support teams validate the AI summary before taking action.",
    icon: Users,
  },
  {
    title: "Agent responds",
    description: "Human-led communication keeps every resolution personalized.",
    icon: MessageSquareText,
  },
  {
    title: "Ticket resolved",
    description: "The full conversation and outcome remain attached to the record.",
    icon: Check,
  },
];

const featureCards = [
  {
    icon: Sparkles,
    title: "AI Ticket Triage",
    description: "Automatically suggest category, priority, and summary.",
  },
  {
    icon: ShieldCheck,
    title: "Human-in-the-Loop AI",
    description: "Agents review and edit AI recommendations before finalizing them.",
  },
  {
    icon: MessageSquareText,
    title: "Real-Time Conversations",
    description: "Customer and agent messages appear instantly without refreshing.",
  },
  {
    icon: Workflow,
    title: "Ticket Lifecycle",
    description: "Track tickets from New to Assigned, In Progress, and Resolved.",
  },
  {
    icon: FileText,
    title: "Persistent History",
    description: "Every customer-agent message remains attached to the ticket.",
  },
  {
    icon: BarChart3,
    title: "Support Dashboard",
    description: "See ticket volume, statuses, and priorities from real data.",
  },
];

const lifecycleStages = [
  {
    id: "new",
    label: "New",
    summary: "Customer has submitted a new support request.",
  },
  {
    id: "assigned",
    label: "Assigned",
    summary: "An agent takes ownership of the ticket.",
  },
  {
    id: "in-progress",
    label: "In Progress",
    summary: "Agent is actively working with the customer.",
  },
  {
    id: "resolved",
    label: "Resolved",
    summary: "Issue has been handled and resolution recorded.",
  },
];

const problemCards = [
  {
    number: "01",
    title: "Understand",
    text: "AI analyzes the customer's message.",
  },
  {
    number: "02",
    title: "Prioritize",
    text: "AI identifies category and urgency.",
  },
  {
    number: "03",
    title: "Resolve",
    text: "Agents review, respond, and resolve.",
  },
];

const SectionBadge = ({ children, dark }) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
      dark
        ? "border-[#2a3550] bg-[#121b2e]/80 text-[#b8c4f0]"
        : "border-[#e8def5] bg-[#f8f2ff]/80 text-[#59566e]"
    }`}
  >
    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#7aa8ff] to-[#9b5ce7] shadow-[0_0_12px_rgba(125,112,255,0.9)]" />
    {children}
  </div>
);

const LandingPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [workflowProgress, setWorkflowProgress] = useState(42);
  const [activeStage, setActiveStage] = useState("assigned");
  const [triageStage, setTriageStage] = useState("incoming");
  const [liveState, setLiveState] = useState("in-progress");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);

      const section = document.getElementById("how-it-works");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.min(100, Math.max(0, ((viewportHeight - rect.top) / (rect.height + viewportHeight)) * 100));
      setWorkflowProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTriageStage((prev) => {
        if (prev === "incoming") return "analyzing";
        if (prev === "analyzing") return "results";
        return "incoming";
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveState((prev) => (prev === "in-progress" ? "resolved" : "in-progress"));
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  const triageStatus = useMemo(() => {
    if (triageStage === "incoming") {
      return {
        label: "Customer message received",
        accent: "text-[#b1d4ff]",
      };
    }
    if (triageStage === "analyzing") {
      return {
        label: "AI analyzing...",
        accent: "text-[#d5b8ff]",
      };
    }

    return {
      label: "Structured result ready",
      accent: "text-[#a9f0c0]",
    };
  }, [triageStage]);

  const themeSurface = isDark
    ? "bg-[#0b0f18] text-[#edf5ff]"
    : "bg-[#f4f0fb] text-[#171827]";

  const panelSurface = isDark
    ? "border-[#202c40] bg-[#101827]/80"
    : "border-[#e8def5] bg-[rgba(255,255,255,0.72)]";

  const mutedText = isDark ? "text-[#aeb9d6]" : "text-[#4d4a61]";
  const softText = isDark ? "text-[#d9e0f5]" : "text-[#2e2b3d]";
  const cardSurface = isDark
    ? "border-[#24314a] bg-[#101b2d]"
    : "border-[#ece1f8] bg-[#f9f5ff]";

  return (
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${themeSurface}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute left-[-8rem] top-[-5rem] h-72 w-72 rounded-full blur-3xl ${isDark ? "bg-[#7b5af7]/18" : "bg-[#9f88ff]/20"}`} />
        <div className={`absolute right-[-5rem] top-20 h-80 w-80 rounded-full blur-3xl ${isDark ? "bg-[#3b82f6]/18" : "bg-[#7eb7ff]/20"}`} />
        <div className={`absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${isDark ? "bg-[#1d4ed8]/12" : "bg-[#8b5cf6]/12"}`} />
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? isDark
              ? "border-[#242f45]/80 bg-[#0b0f18]/80"
              : "border-[#eae0f9]/80 bg-[#f4f0fb]/80"
            : "border-transparent bg-transparent"
        } ${isReady ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#product" className="flex items-center gap-3" aria-label="SupportFlow AI home">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8ab0ff] to-[#8b5cf6] text-white shadow-[0_12px_30px_rgba(128,141,255,0.45)]`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold tracking-[-0.05em]">
                <span>SupportFlow</span>
                <span className="rounded-md bg-gradient-to-r from-[#7aa8ff] to-[#986af7] bg-clip-text px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-transparent">
                  AI
                </span>
              </div>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${isDark ? "text-[#dfeafc] hover:text-white" : "text-[#413f58] hover:text-[#1c152d]"}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a href="#login" className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${isDark ? "text-[#e7ebff] hover:bg-[#131d30]" : "text-[#272334] hover:bg-[#f0e4ff]"}`}>
              Login
            </a>
            <Link
             to='/login'
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7aa8ff] to-[#8b5cf6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(91,94,255,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Themetogglebutton />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Themetogglebutton />
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${isDark ? "border-[#2a3550] bg-[#101827] text-white" : "border-[#eae0f8] bg-white text-[#241d32]"}`}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className={`border-t px-4 py-4 md:hidden ${isDark ? "border-[#202c40] bg-[#0c1220]" : "border-[#ece1f8] bg-[#f8f5ff]"}`}>
            <div className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-3 py-2 text-sm font-medium ${isDark ? "text-[#e7ebff] hover:bg-[#121b2e]" : "text-[#2b2838] hover:bg-[#f1e7ff]"}`}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <a href="#login" className={`rounded-xl px-3 py-2 text-sm font-medium ${isDark ? "text-[#e7ebff] hover:bg-[#121b2e]" : "text-[#2b2838] hover:bg-[#f1e7ff]"}`}>
                  Login
                </a>
                <Link to="/login" className="rounded-xl bg-gradient-to-r from-[#7aa8ff] to-[#8b5cf6] px-3 py-2 text-center text-sm font-semibold text-white">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="product">
        <section className={`relative mx-auto max-w-7xl px-4 pb-20 pt-12 transition-all duration-700 ease-out sm:px-6 lg:px-8 lg:pb-28 lg:pt-20 ${isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div style={{ transitionDelay: "80ms" }} className={isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}>
              <SectionBadge dark={isDark}>AI-powered customer support</SectionBadge>
              <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-[-0.08em] text-balance sm:text-6xl lg:text-7xl">
                Resolve support tickets
                <span className="block bg-gradient-to-r from-[#70a9ff] via-[#88a4ff] to-[#9b5ce7] bg-clip-text text-transparent">
                  with intelligence.
                </span>
              </h1>
              <p className={`mt-6 max-w-xl text-lg leading-8 ${mutedText}`}>
                SupportFlow combines AI-powered ticket triage with human expertise, helping support teams understand, prioritize, and resolve customer issues faster.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7aa8ff] to-[#8b5cf6] px-6 py-3.5 text-base font-semibold text-white shadow-[0_18px_36px_rgba(94,110,255,0.3)] transition-transform hover:-translate-y-0.5">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how-it-works" className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-base font-semibold transition-colors ${isDark ? "border-[#2b3550] bg-[#101827] text-[#edf2ff] hover:bg-[#121f33]" : "border-[#e7dff4] bg-white/70 text-[#221f2e] hover:bg-[#f5eeff]"}`}>
                  See How It Works
                </a>
              </div>

              <div className={`mt-8 flex flex-wrap items-center gap-3 text-sm font-medium ${mutedText}`}>
                <span>AI Triage</span>
                <span className="h-1 w-1 rounded-full bg-[#7d82d7]" />
                <span>Human Review</span>
                <span className="h-1 w-1 rounded-full bg-[#7d82d7]" />
                <span>Real-Time Support</span>
              </div>
            </div>

            <div className={`relative mx-auto w-full max-w-[620px] transition-all duration-700 ease-out ${isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "160ms" }}>
              <div className={`absolute -left-8 top-8 h-16 w-16 rounded-full blur-2xl ${isDark ? "bg-[#7c5ef4]/25" : "bg-[#8b5cf6]/20"}`} />
              <div className={`absolute -right-6 bottom-12 h-20 w-20 rounded-full blur-2xl ${isDark ? "bg-[#60a5fa]/20" : "bg-[#7aa8ff]/20"}`} />

              <div className={`glass-panel relative rounded-[28px] border p-5 shadow-[0_30px_80px_rgba(15,23,42,0.45)] ${panelSurface}`}>
                <div className={`mb-5 flex items-center justify-between rounded-2xl border px-4 py-3 ${isDark ? "border-[#202c40] bg-[#0d1524]" : "border-[#edebfa] bg-white/60"}`}>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f7c948]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#50d17a]" />
                  </div>
                  <div className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${isDark ? "border-[#2d3e5f] text-[#d7def6]" : "border-[#ece1f7] text-[#4a4963]"}`}>
                    LIVE
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className={`float-slow rounded-[22px] border p-4 ${cardSurface}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className={`text-[10px] font-medium uppercase tracking-[0.22em] ${mutedText}`}>Ticket</div>
                        <div className="mt-1 text-2xl font-semibold tracking-[-0.06em]">TKT-4928</div>
                      </div>
                      <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${isDark ? "border-[#3b2e52] bg-[#20182c] text-[#d9b7ff]" : "border-[#e4d8ff] bg-[#f5edff] text-[#5a4c7a]"}`}>
                        High
                      </div>
                    </div>

                    <h3 className={`mt-5 text-xl font-semibold tracking-[-0.05em] ${softText}`}>
                      Double charge on Pro subscription
                    </h3>

                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className={mutedText}>Priority</span>
                        <span className="rounded-full bg-[#ff6b6b]/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff7b7b]">High</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className={mutedText}>Category</span>
                        <span className="rounded-full bg-[#7a90ff]/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#87a8ff]">Billing</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className={mutedText}>Status</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#6ae3a3]/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#75d88c]">
                          <span className="h-2 w-2 rounded-full bg-[#75d88c] pulse-glow" />
                          In Progress
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`float-slow rounded-[22px] border p-4 ${cardSurface}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Bot className="h-4 w-4 text-[#7aa8ff]" />
                        <span className={softText}>AI Triage Suggestion</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#7da8ff]">
                        <span className="h-2 w-2 rounded-full bg-[#7aa8ff] pulse-glow" />
                        Live
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className={mutedText}>Category</span>
                        <span className="font-medium text-[#dfe6ff]">Billing</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={mutedText}>Priority</span>
                        <span className="font-medium text-[#ffd0d0]">High</span>
                      </div>
                      <div className="mt-4 rounded-2xl border border-[#2d3b62] bg-[#0d1524] p-3">
                        <div className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>Summary</div>
                        <p className="mt-2 text-sm leading-6 text-[#eafdff]">
                          Possible duplicate payment reported by customer.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className={`text-[10px] font-medium uppercase tracking-[0.2em] ${mutedText}`}>Confidence</div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-[#8cc6ff]">94%</div>
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#1b2740]">
                      <div className="h-2 w-[94%] rounded-full bg-gradient-to-r from-[#70a9ff] via-[#8b7dff] to-[#9b5ce7]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
              Support shouldn&apos;t feel like detective work.
            </h2>
            <p className={`mt-5 text-lg leading-8 ${mutedText}`}>
              Support teams spend valuable time reading, categorizing, prioritizing, and routing repetitive customer issues.
            </p>
            <p className={`mt-3 text-lg leading-8 ${mutedText}`}>
              SupportFlow turns every incoming issue into an actionable support ticket.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {problemCards.map((card, index) => (
              <div
                key={card.number}
                className={`group rounded-[26px] border p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#687ef6]/50 hover:shadow-[0_24px_50px_rgba(95,110,255,0.18)] ${cardSurface} ${isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${mutedText}`}>{card.number}</span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#7aa8ff] to-[#8b5cf6] text-white shadow-[0_12px_24px_rgba(117,122,255,0.35)]`}>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.06em]">{card.title}</h3>
                <p className={`mt-4 text-base leading-7 ${mutedText}`}>{card.text}</p>
                <div className="mt-8 h-px w-full bg-gradient-to-r from-[#7aa8ff]/35 via-[#9b5ce7]/50 to-transparent" />
                <div className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-[#7aa8ff]">
                  Step {index + 1}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <SectionBadge dark={isDark}>Workflow</SectionBadge>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
              From customer issue to resolution.
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 right-8 top-[34%] hidden h-0.5 md:block">
              <div className={`h-full w-full rounded-full ${isDark ? "bg-[#273656]" : "bg-[#eae0f8]"}`} />
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7aa8ff] via-[#8b5cf6] to-[#9b5ce7] shadow-[0_0_26px_rgba(120,110,255,0.55)]"
                style={{ width: `${workflowProgress}%`, transformOrigin: "left center" }}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-5">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative">
                    <div
                      className={`group rounded-[24px] border p-5 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#758cff]/60 hover:shadow-[0_24px_40px_rgba(102,112,255,0.18)] ${cardSurface} ${isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${index * 120}ms` }}
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${mutedText}`}>0{index + 1}</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#7aa8ff]/15 via-[#8a7dff]/20 to-[#9b5ce7]/15 text-[#8db8ff] shadow-inner">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold tracking-[-0.04em]">{step.title}</h3>
                      <p className={`mt-3 text-sm leading-6 ${mutedText}`}>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="ai-triage" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge dark={isDark}>AI triage</SectionBadge>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
              AI handles the first read.
              <span className="block">Your team makes the final call.</span>
            </h2>
            <p className={`mt-5 text-lg leading-8 ${mutedText}`}>
              SupportFlow analyzes incoming tickets and provides structured suggestions while keeping humans in control.
            </p>
          </div>

          <div className={`mt-12 rounded-[28px] border p-5 transition-all duration-700 ease-out sm:p-7 ${panelSurface} ${isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "160ms" }}>
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className={`rounded-[24px] border p-5 ${cardSurface}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${isDark ? "border-[#2a3550] bg-[#121a2b] text-[#c4d0f6]" : "border-[#e7def6] bg-[#fbf8ff] text-[#615c73]"}`}>
                    New ticket
                  </div>
                  <div className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>{triageStatus.label}</div>
                </div>

                {triageStage === "incoming" && (
                  <div className="mt-5 rounded-[20px] border border-[#2b3857] bg-[#0d1524] p-4">
                    <div className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>Customer message</div>
                    <p className="mt-3 text-base leading-7 text-[#eaf1ff]">
                      I was charged twice for the same order and need one payment refunded.
                    </p>
                  </div>
                )}

                {triageStage === "analyzing" && (
                  <div className="mt-5 rounded-[20px] border border-[#2d3d66] bg-[#0d1524] p-4">
                    <div className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>AI analyzing</div>
                    <div className="mt-4 flex items-center gap-3 text-[#d9c2ff]">
                      <CircleDashed className="h-4 w-4 animate-spin text-[#b998ff]" />
                      <span className="text-sm font-medium">Reviewing customer intent and billing risk</span>
                    </div>
                    <div className="mt-4 h-2 w-full rounded-full bg-[#1a2640]">
                      <div className="ai-shimmer h-2 w-2/3 rounded-full bg-gradient-to-r from-[#6da5ff] via-[#8f7efc] to-[#a76aff]" />
                    </div>
                  </div>
                )}

                {triageStage === "results" && (
                  <div className="mt-5 space-y-4 rounded-[20px] border border-[#2a3550] bg-[#0d1524] p-4">
                    <div>
                      <div className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>Category</div>
                      <div className="mt-2 text-lg font-semibold text-[#dfeeff]">Billing</div>
                    </div>
                    <div>
                      <div className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>Priority</div>
                      <div className="mt-2 text-lg font-semibold text-[#ffd3d3]">High</div>
                    </div>
                    <div>
                      <div className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>Summary</div>
                      <p className="mt-2 text-sm leading-7 text-[#ebf4ff]">
                        Possible duplicate payment reported by customer.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className={`rounded-[24px] border p-5 ${cardSurface}`}>
                <div className="flex items-center justify-between gap-3 border-b border-[#2a3550] pb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4 text-[#7aa8ff]" />
                    <span className={softText}>Human review</span>
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>
                    AI suggestions require human review
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <label className={`block text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>Category</label>
                    <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${isDark ? "border-[#2a3550] bg-[#121a2b] text-[#eef6ff]" : "border-[#e5ddf6] bg-[#fbf9ff] text-[#2a2738]"}`}>
                      <span>Billing</span>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>Priority</label>
                    <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${isDark ? "border-[#2a3550] bg-[#121a2b] text-[#eef6ff]" : "border-[#e5ddf6] bg-[#fbf9ff] text-[#2a2738]"}`}>
                      <span>High</span>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>Summary</label>
                    <div className={`rounded-2xl border p-4 ${isDark ? "border-[#2a3550] bg-[#121a2b] text-[#edf2ff]" : "border-[#e5ddf6] bg-[#fbf9ff] text-[#2a2738]"}`}>
                      Possible duplicate payment reported by customer.
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7aa8ff] to-[#8b5cf6] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(96,108,255,0.3)] transition-transform hover:-translate-y-0.5">
                    Accept Suggestion
                    <Check className="h-4 w-4" />
                  </button>
                  <button className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold ${isDark ? "border-[#2a3550] bg-[#101827] text-[#ebf4ff] hover:bg-[#121d32]" : "border-[#e7dff4] bg-white text-[#261e32] hover:bg-[#f4ebff]"}`}>
                    Edit & Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge dark={isDark}>Features</SectionBadge>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
              Everything your support team needs.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className={`group rounded-[24px] border p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#7a8efd]/60 hover:shadow-[0_18px_36px_rgba(93,103,255,0.16)] ${cardSurface} ${isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 110}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7aa8ff]/18 to-[#9b5ce7]/18 text-[#8ab4ff] shadow-[inset_0_0_0_1px_rgba(122,168,255,0.15)] transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.05em]">{title}</h3>
                <p className={`mt-3 text-base leading-7 ${mutedText}`}>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge dark={isDark}>Live support</SectionBadge>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
              Keep conversations moving.
            </h2>
          </div>

          <div className={`mt-12 overflow-hidden rounded-[30px] border p-5 transition-all duration-700 ease-out sm:p-7 ${panelSurface} ${isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "180ms" }}>
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] ${isDark ? "border-[#2a3550] bg-[#121c2f] text-[#dce8ff]" : "border-[#ece0f6] bg-white text-[#473f5c]"}`}>
                  <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
                  Live
                </span>
                <span className={`text-[10px] font-medium uppercase tracking-[0.18em] ${mutedText}`}>
                  Status: {liveState === "in-progress" ? "IN PROGRESS" : "RESOLVED"}
                </span>
              </div>
              <div className={`rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] ${isDark ? "border-[#2a3550] bg-[#111b2b] text-[#dce3ff]" : "border-[#ece0f6] bg-white text-[#473f5c]"}`}>
                {liveState === "in-progress" ? "In Progress" : "Resolved"}
              </div>
            </div>

            <div className={`rounded-[24px] border p-4 sm:p-5 ${cardSurface}`}>
              <div className="space-y-4">
                <div className={`max-w-[80%] rounded-[20px] rounded-br-md border px-4 py-3 ${isDark ? "border-[#2b3855] bg-[#101a2a] text-[#eaf2ff]" : "border-[#e7dff2] bg-white text-[#2d2a39]"}`}>
                  Customer: “I was charged twice for my subscription.”
                </div>
                <div className={`ml-auto max-w-[80%] rounded-[20px] rounded-bl-md border px-4 py-3 ${isDark ? "border-[#2a3955] bg-[#141d30] text-[#eaf2ff]" : "border-[#e7dff2] bg-[#f4ecff] text-[#2d2a39]"}`}>
                  Agent: “I&apos;m checking that for you now.”
                </div>
                {liveState === "resolved" && (
                  <div className={`ml-auto max-w-[80%] rounded-[20px] rounded-bl-md border border-[#2a6e49] bg-[#123326] px-4 py-3 text-[#dff6e7]`}>
                    Duplicate charge confirmed. Your refund has been initiated.
                  </div>
                )}
              </div>

              <div className={`mt-6 flex items-center justify-between gap-3 border-t pt-4 ${isDark ? "border-[#2a3550]" : "border-[#ece1f8]"}`}>
                <div className={`text-sm ${mutedText}`}>Messages and ticket status update in real time.</div>
                <div className={`inline-flex items-center gap-2 rounded-full ${liveState === "resolved" ? "bg-[#1a5a3c] text-[#d8fce8]" : "bg-[#142847] text-[#b4cbff]"} px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]`}>
                  <span className={`h-2 w-2 rounded-full ${liveState === "resolved" ? "bg-[#6ae3a3]" : "bg-[#7aa8ff]"}`} />
                  {liveState === "resolved" ? "Resolved" : "In Progress"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <SectionBadge dark={isDark}>Lifecycle</SectionBadge>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
              Every ticket moves with clarity.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {lifecycleStages.map((stage, index) => (
              <button
                key={stage.id}
                type="button"
                onMouseEnter={() => setActiveStage(stage.id)}
                onFocus={() => setActiveStage(stage.id)}
                onClick={() => setActiveStage(stage.id)}
                className={`group rounded-[24px] border p-5 text-left transition-all duration-500 ease-out ${activeStage === stage.id ? (isDark ? "border-[#768cff]/70 bg-[#111d31] shadow-[0_18px_40px_rgba(102,121,255,0.18)]" : "border-[#7a8efd]/60 bg-[#f5f0ff] shadow-[0_18px_40px_rgba(129,116,255,0.16)]") : cardSurface} ${isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 130}ms` }}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${mutedText}`}>{stage.label}</span>
                  <div className={`h-2.5 w-2.5 rounded-full ${activeStage === stage.id ? "bg-gradient-to-r from-[#7aa8ff] to-[#9b5ce7]" : isDark ? "bg-[#394b6e]" : "bg-[#d5cde9]"}`} />
                </div>
                <div className={`mb-4 h-px w-full ${isDark ? "bg-[#2a3550]" : "bg-[#E9E0F8]"}`} />
                <p className={`text-sm leading-7 ${activeStage === stage.id ? softText : mutedText}`}>{stage.summary}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="cta" className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className={`relative overflow-hidden rounded-[32px] border p-8 text-center shadow-[0_30px_80px_rgba(90,106,255,0.18)] transition-all duration-700 ease-out sm:p-12 ${panelSurface} ${isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "200ms" }}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(122,168,255,0.2),_transparent_45%)]" />
            <div className="relative z-10">
              <SectionBadge dark={isDark}>Ready to move faster?</SectionBadge>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
                Turn every support request
                <span className="block">into a resolved conversation.</span>
              </h2>
              <p className={`mx-auto mt-5 max-w-2xl text-lg leading-8 ${mutedText}`}>
                Give your support team the context, intelligence, and workflow they need to move faster.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7aa8ff] to-[#8b5cf6] px-6 py-3.5 text-base font-semibold text-white shadow-[0_18px_38px_rgba(106,118,255,0.34)] transition-transform hover:-translate-y-0.5">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#features" className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-base font-semibold ${isDark ? "border-[#2b3550] bg-[#101827] text-[#edf2ff] hover:bg-[#121d32]" : "border-[#e7dff4] bg-white/70 text-[#272334] hover:bg-[#f5eeff]"}`}>
                  Explore Dashboard
                  <LayoutDashboard className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={`border-t ${isDark ? "border-[#202c40] bg-[#0b0f18]/80" : "border-[#e7dff4] bg-[#f7f2ff]/80"}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8ab0ff] to-[#8b5cf6] text-white shadow-[0_12px_24px_rgba(124,116,255,0.35)]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-[-0.05em]">SupportFlow AI</div>
              </div>
            </div>
            <p className={`mt-3 text-sm ${mutedText}`}>AI-assisted support. Human-led resolution.</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className={`transition-colors ${isDark ? "text-[#dfeafd] hover:text-white" : "text-[#403c53] hover:text-[#1a1725]"}`}>
                {item.label}
              </a>
            ))}
            <a href="#login" className={`transition-colors ${isDark ? "text-[#dfeafd] hover:text-white" : "text-[#403c53] hover:text-[#1a1725]"}`}>
              Login
            </a>
            <a href="#register" className={`transition-colors ${isDark ? "text-[#dfeafd] hover:text-white" : "text-[#403c53] hover:text-[#1a1725]"}`}>
              Register
            </a>
          </div>

          <div className={`text-sm ${mutedText}`}>Built for AI Factory 2.0</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
