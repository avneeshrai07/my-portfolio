
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from "@/data/projects.json";
import { Safari } from "@/components/ui/safari";

gsap.registerPlugin(ScrollTrigger);

interface TechStack {
  name: string;
  color: string;
}
interface ProjectMetric {
  label: string;
  value: string;
}
interface Project {
  id: string;
  title: string;
  tagline: string;
  heroImage: string;
  description: string;
  techStack: TechStack[];
  features: string[];
  images: { desktop: string; mobile: string };
  metrics: ProjectMetric[];
  challenges: string[];
  demoUrl?: string;
  githubUrl?: string;
  theme: { primary: string; secondary: string; accent: string };
}

// ─────────────────── Phone Frame ───────────────────
// Realistic iPhone-style frame for mobile screenshots
function PhoneFrame({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex-shrink-0 ${className ?? ""}`}
      style={{ aspectRatio: "9 / 19.5" }}
    >
      {/* Screen content */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: "3.5%",
          left: "5%",
          right: "5%",
          bottom: "3.5%",
          borderRadius: "12px",
          zIndex: 0,
        }}
      >
        <img
          src={src}
          alt="Mobile preview"
          className="w-full h-full object-cover object-top"
        />
      </div>
      {/* Phone bezel */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        viewBox="0 0 90 195"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 1 }}
      >
        <rect
          x="1.5"
          y="1.5"
          width="87"
          height="192"
          rx="14.5"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        {/* Side buttons */}
        <rect x="0" y="52" width="2.5" height="22" rx="1.25" fill="#2a2a2a" />
        <rect x="0" y="80" width="2.5" height="22" rx="1.25" fill="#2a2a2a" />
        <rect x="87.5" y="66" width="2.5" height="32" rx="1.25" fill="#2a2a2a" />
        {/* Dynamic island */}
        <rect x="32" y="6" width="26" height="7" rx="3.5" fill="#1a1a1a" />
        {/* Home indicator */}
        <rect x="33" y="184" width="24" height="3" rx="1.5" fill="#1a1a1a" opacity="0.4" />
      </svg>
    </div>
  );
}

// ─────────────────── Tablet Frame ───────────────────
function TabletFrame({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex-shrink-0 ${className ?? ""}`}
      style={{ aspectRatio: "3 / 4" }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          top: "9.5%",
          left: "7.8%",
          right: "7.8%",
          bottom: "9.5%",
          borderRadius: "2px",
          zIndex: 0,
        }}
      >
        <img
          src={src}
          alt="Desktop preview"
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ zIndex: 1, borderRadius: "12px", border: "6px solid #1f2937" }}
      />
    </div>
  );
}

// ─────────────────── Read More Toggle ───────────────────
function MobileDescription({
  description,
}: {
  description: string;
  primary: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 130;
  const isLong = description.length > LIMIT;

  return (
    <div>
      <p className="text-sm font-bold text-gray-900 mb-1">
        Project Description:
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">
        {expanded || !isLong ? description : `${description.slice(0, LIMIT)}...`}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-sm text-gray-500 font-medium flex items-center gap-1 hover:text-gray-700 transition-colors"
        >
          {expanded ? "Show less ▲" : "Read more ▼"}
        </button>
      )}
    </div>
  );
}

// ─────────────────── Main Export ───────────────────
export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // GSAP stack animation is designed for the fixed 90vh desktop card.
    // On mobile cards are height:auto so we skip it entirely.
    if (!containerRef.current) return;
    if (window.innerWidth < 1024) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return;
        const nextCard = cards[index + 1];
        gsap.to(card, {
          scale: 0.88 - index * 0.015,
          opacity: 1,
          y: -20,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top 12%",
            end: "top -2%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-[5vh] bg-hero-gradient">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-[10vh]">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-gray-900 mb-[1vh]">
            Featured Projects
          </h2>
          <p className="text-[clamp(0.9rem,1.5vw,1.25rem)] text-gray-600 max-w-2xl mx-auto">
            A collection of full-stack applications showcasing modern web
            development practices and creative solutions
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative"
          style={{ perspective: "1400px" }}
        >
          {(projectsData as Project[]).map((project, index) => {
            const isLast = index === (projectsData as Project[]).length - 1;
            return (
              /*
               * MOBILE FIX — sticky scroll distance
               *
               * Desktop: card = 90vh, so sticky scroll distance is implicit.
               * Mobile: card = height:auto (tall). Without an explicit scroll
               * distance the next sticky card overlaps immediately.
               *
               * Fix: wrap each non-last card in a div whose padding-bottom on
               * mobile equals 100vh. The inner sticky div pins to top:0 while
               * the outer wrapper gives the scroll room to breathe.
               * On lg+ we set padding-bottom:0 so desktop is unaffected.
               */
              <div
                key={project.id}
                className={isLast ? "" : "pb-[0vh] lg:pb-0"}
              >
                <div
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: index + 1,
                    paddingTop: index > 0 ? `${index * 8}px` : "0px",
                    willChange: "transform, opacity, filter",
                    transformOrigin: "top center",
                  }}
                >
                  <ProjectCard project={project} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────── Project Card ───────────────────
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
      {/* ══════════════ DESKTOP LAYOUT ══════════════ */}
      <div
        className="hidden lg:flex flex-col"
        style={{ height: "90vh", minHeight: "600px" }}
      >
        {/* Hero Banner — 18% */}
        <div className="relative flex-shrink-0 overflow-hidden rounded-t-[2.5rem]" style={{ height: "18%" }}>
          <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20" />
          <div className="absolute top-[1vh] right-[2vw] text-right">
            <p
              className="text-white uppercase tracking-[0.3em] mb-[0.5vh] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ fontSize: "clamp(0.65rem,0.9vh,0.85rem)" }}
            >
              {project.tagline}
            </p>
            <h3
              className="text-white font-bold tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              style={{ fontSize: "clamp(2rem,4vh,3.5rem)" }}
            >
              {project.title.split(" ")[0].toUpperCase()}
            </h3>
          </div>
        </div>

        {/* Content Grid — 82% */}
        <div
          className="grid grid-cols-2 gap-0 flex-1 min-h-0 overflow-hidden"
          style={{
            background: `linear-gradient(180deg,${project.theme.secondary},${project.theme.secondary})`,
            height: "82%",
          }}
        >
          {/* Left */}
          <div
            className="flex flex-col h-full overflow-hidden"
            style={{ padding: "clamp(1.5rem,2.5vh,2.5rem)" }}
          >
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden pr-3 pb-2 scrollbar-hide"
              style={{ height: "calc(100% - 80px)", minHeight: 0 }}
            >
              <div className="space-y-[2vh]">
                <h4
                  className="font-bold leading-tight"
                  style={{ color: project.theme.accent, fontSize: "clamp(1.5rem,3vh,2.5rem)" }}
                >
                  {project.title}
                </h4>
                <div className="space-y-[0.8vh]">
                  <div className="flex flex-wrap gap-[0.5vh]">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech.name}
                        className="rounded-full font-semibold flex items-center shadow-sm"
                        style={{
                          backgroundColor: tech.color,
                          color: "white",
                          padding: "clamp(0.3rem,0.8vh,0.6rem) clamp(0.6rem,1.2vh,1rem)",
                          fontSize: "clamp(0.7rem,1.2vh,0.9rem)",
                          gap: "clamp(0.3rem,0.5vh,0.5rem)",
                        }}
                      >
                        <span
                          className="bg-white/25 rounded-full flex items-center justify-center"
                          style={{
                            width: "clamp(1rem,1.8vh,1.5rem)",
                            height: "clamp(1rem,1.8vh,1.5rem)",
                            fontSize: "clamp(0.5rem,0.8vh,0.7rem)",
                          }}
                        >
                          ⚛
                        </span>
                        {tech.name}
                      </span>
                    ))}
                  </div>
                  {project.techStack[4] && (
                    <div className="flex flex-wrap gap-[0.5vh]">
                      <span
                        className="rounded-full font-semibold flex items-center shadow-sm"
                        style={{
                          backgroundColor: project.techStack[4].color,
                          color: "white",
                          padding: "clamp(0.3rem,0.8vh,0.6rem) clamp(0.6rem,1.2vh,1rem)",
                          fontSize: "clamp(0.7rem,1.2vh,0.9rem)",
                          gap: "clamp(0.3rem,0.5vh,0.5rem)",
                        }}
                      >
                        <span
                          className="bg-white/25 rounded-full flex items-center justify-center"
                          style={{
                            width: "clamp(1rem,1.8vh,1.5rem)",
                            height: "clamp(1rem,1.8vh,1.5rem)",
                            fontSize: "clamp(0.5rem,0.8vh,0.7rem)",
                          }}
                        >
                          🎨
                        </span>
                        {project.techStack[4].name}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-[0.5vh]">
                    {project.techStack.slice(5).map((tech) => (
                      <span
                        key={tech.name}
                        className="rounded-full font-semibold flex items-center shadow-sm"
                        style={{
                          backgroundColor: tech.color,
                          color: "white",
                          padding: "clamp(0.3rem,0.8vh,0.6rem) clamp(0.6rem,1.2vh,1rem)",
                          fontSize: "clamp(0.7rem,1.2vh,0.9rem)",
                          gap: "clamp(0.3rem,0.5vh,0.5rem)",
                        }}
                      >
                        <span
                          className="bg-white/25 rounded-full flex items-center justify-center"
                          style={{
                            width: "clamp(1rem,1.8vh,1.5rem)",
                            height: "clamp(1rem,1.8vh,1.5rem)",
                            fontSize: "clamp(0.5rem,0.8vh,0.7rem)",
                          }}
                        >
                          🗄
                        </span>
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-800 leading-relaxed" style={{ fontSize: "clamp(0.85rem,1.4vh,1.1rem)" }}>
                  {project.description}
                </p>
                <div>
                  <h5
                    className="font-bold text-gray-900"
                    style={{
                      fontSize: "clamp(1rem,1.8vh,1.3rem)",
                      marginBottom: "clamp(0.5rem,1vh,0.8rem)",
                    }}
                  >
                    Key Features:
                  </h5>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "clamp(0.3rem,0.8vh,0.6rem)" }}>
                    {project.features.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-800">
                        <span style={{ marginRight: "clamp(0.5rem,1vh,0.8rem)", fontSize: "clamp(1rem,1.5vh,1.2rem)" }}>•</span>
                        <span style={{ fontSize: "clamp(0.85rem,1.4vh,1rem)", lineHeight: "1.5" }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div
              className="flex gap-3 pt-3 flex-shrink-0 border-t border-gray-300/30"
              style={{ height: "80px", alignItems: "center" }}
            >
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-full text-white font-bold text-center transition-all hover:scale-105 hover:shadow-xl flex items-center justify-center"
                  style={{
                    backgroundColor: project.theme.primary,
                    fontSize: "clamp(0.85rem,1.4vh,1rem)",
                    gap: "0.5rem",
                  }}
                >
                  <span>Live Demo</span>
                  <span>🖥️</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-full font-bold text-center transition-all hover:scale-105 hover:shadow-xl flex items-center justify-center bg-white"
                  style={{
                    color: project.theme.accent,
                    border: `2px solid ${project.theme.accent}`,
                    fontSize: "clamp(0.85rem,1.4vh,1rem)",
                    gap: "0.5rem",
                  }}
                >
                  <span>GitHub</span>
                  <span>⚙️</span>
                </a>
              )}
            </div>
          </div>

          {/* Right */}
          <div
            className="flex flex-col h-full overflow-hidden"
            style={{ padding: "clamp(1rem,2vh,2rem)", gap: "clamp(0.8rem,1.5vh,1.2rem)" }}
          >
            {/* Desktop browser frame — top 60% */}
            <div className="relative flex-shrink-0 overflow-hidden" style={{ height: "60%" }}>
              <div
                className="w-full h-full rounded-3xl overflow-hidden flex items-center justify-center"
                style={{
                  backgroundColor: project.theme.secondary,
                  padding: "clamp(0.8rem,1.5vh,1.2rem)",
                }}
              >
                {/* 
                  FIX: Safari must be constrained to its parent.
                  Remove objectFit (only valid on <img>) and instead cap
                  the frame with max-w/max-h + auto dimensions so it
                  scales down to fit without overflowing.
                */}
                <Safari
                  url={project.demoUrl ?? "project.demo"}
                  imageSrc={project.images.desktop}
                  className="w-auto h-auto max-w-half max-h-full"
                />
              </div>
            </div>

            {/* Bottom two panels */}
            <div
              className="flex gap-[1.5vh] flex-1 min-h-0 overflow-hidden"
            >
              <div
                className="rounded-3xl shadow-lg flex-1 overflow-hidden flex flex-col"
                style={{
                  backgroundColor: project.theme.primary,
                  padding: "clamp(1rem,2vh,1.5rem)",
                }}
              >
                <h5
                  className="font-bold text-white flex-shrink-0"
                  style={{
                    fontSize: "clamp(0.9rem,1.6vh,1.2rem)",
                    marginBottom: "clamp(0.6rem,1.2vh,1rem)",
                  }}
                >
                  Project Metrics:
                </h5>
                <ul
                  className="flex-1 overflow-y-auto scrollbar-hide"
                  style={{ display: "flex", flexDirection: "column", gap: "clamp(0.5rem,1vh,0.8rem)" }}
                >
                  {project.metrics.map((metric) => (
                    <li key={metric.label} className="flex items-center justify-between text-white">
                      <span
                        className="flex items-center"
                        style={{ gap: "clamp(0.3rem,0.6vh,0.5rem)", fontSize: "clamp(0.75rem,1.3vh,0.95rem)" }}
                      >
                        <span>•</span>
                        <span>{metric.label}</span>
                      </span>
                      <span className="font-bold" style={{ fontSize: "clamp(1.1rem,2vh,1.5rem)" }}>
                        {metric.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-3xl bg-white shadow-lg flex-1 overflow-hidden flex flex-col"
                style={{ padding: "clamp(1rem,2vh,1.5rem)" }}
              >
                <h5
                  className="font-bold text-gray-900 flex-shrink-0"
                  style={{
                    fontSize: "clamp(0.9rem,1.6vh,1.2rem)",
                    marginBottom: "clamp(0.6rem,1.2vh,1rem)",
                  }}
                >
                  Challenges & Solutions:
                </h5>
                <ul
                  className="flex-1 overflow-y-auto scrollbar-hide"
                  style={{ display: "flex", flexDirection: "column", gap: "clamp(0.4rem,0.8vh,0.6rem)" }}
                >
                  {project.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start text-gray-800">
                      <span
                        style={{
                          marginRight: "clamp(0.3rem,0.6vh,0.5rem)",
                          fontSize: "clamp(0.75rem,1.3vh,0.95rem)",
                        }}
                      >
                        •
                      </span>
                      <span style={{ fontSize: "clamp(0.7rem,1.2vh,0.85rem)", lineHeight: "1.5" }}>
                        {challenge}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ MOBILE LAYOUT ══════════════ */}
      {/* 
        FIX: Removed fixed height="90vh" — mobile card is now height:auto so
        all content is fully visible without clipping. The sticky scroll effect
        on mobile is driven by the parent wrapper, not this inner card.
      */}
      <div
        className="flex lg:hidden flex-col"
        style={{ backgroundColor: "#f5f1ea" }}
      >
        {/* Hero Image */}
        <div
          className="relative w-full flex-shrink-0 overflow-hidden rounded-t-[2.5rem]"
          style={{ height: "200px" }}
        >
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <p
            className="absolute bottom-3 left-4 text-white text-xs font-semibold uppercase tracking-widest drop-shadow"
          >
            {project.tagline}
          </p>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-8 space-y-4">
          {/* Title */}
          <h3
            className="text-xl font-bold leading-tight"
            style={{ color: project.theme.primary }}
          >
            {project.title}
          </h3>

          {/* Tech Stack */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-2">Tech Stack:</p>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech.name}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-sm"
                  style={{ backgroundColor: tech.color }}
                >
                  <span
                    className="bg-white/25 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ width: 14, height: 14, fontSize: 8 }}
                  >
                    ⚛
                  </span>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <MobileDescription
            description={project.description}
            primary={project.theme.primary}
          />

          {/* Visual Preview — phone + desktop side by side */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-2">Visual Preview:</p>
            <div
              className="overflow-hidden rounded-2xl"
              style={{ backgroundColor: project.theme.secondary, padding: "12px" }}
            >
              {/*
                FIX: Phone frame for `images.mobile`, TabletFrame for `images.desktop`.
                Both align to bottom so they feel grounded together.
                Outer container has explicit height; items snap for swipe UX.
              */}
              <div
                className="flex items-end gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory"
                style={{ height: "200px" }}
              >
                {/* Phone frame — mobile screenshot */}
                <div className="flex-shrink-0 snap-center flex items-end h-full">
                  <PhoneFrame
                    src={project.images.mobile}
                    className="h-full w-auto"
                  />
                </div>
                {/* Tablet / desktop frame */}
                <div className="flex-shrink-0 snap-center flex items-end h-full">
                  <TabletFrame
                    src={project.images.desktop}
                    className="h-[85%] w-auto"
                  />
                </div>
              </div>
              <p className="text-center text-[10px] mt-1.5 font-medium opacity-50" style={{ color: project.theme.accent }}>
                ← swipe to explore →
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-2">Key Features:</p>
            <div className="space-y-1.5">
              {project.features.map((feature) => (
                <details
                  key={feature}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  <summary className="flex justify-between items-center px-3 py-2.5 cursor-pointer select-none list-none">
                    <span className="text-xs font-bold text-gray-900">{feature}</span>
                    <span className="text-gray-400 text-[10px] transform transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-2">
                      ▼
                    </span>
                  </summary>
                  <div className="px-3 pb-2.5 pt-1.5 text-xs text-gray-600 border-t border-gray-100 leading-relaxed">
                    Implementation details for {feature}.
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Metrics — 2×2 grid */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-2">Project Metrics:</p>
            <div className="grid grid-cols-2 gap-2">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="bg-white rounded-xl px-3 py-2.5 shadow-sm">
                  <p className="text-xs text-gray-500 mb-0.5">{metric.label}</p>
                  <p
                    className="text-lg font-bold"
                    style={{
                      color: metric.value.toLowerCase().includes("live")
                        ? "#22c55e"
                        : "#111827",
                    }}
                  >
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges & Solutions */}
          <details className="group bg-white rounded-xl shadow-sm overflow-hidden">
            <summary className="flex justify-between items-center px-3 py-2.5 cursor-pointer select-none list-none">
              <span className="text-sm font-bold text-gray-900">Challenges & Solutions:</span>
              <span className="text-gray-400 text-[10px] transform transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
              <ul className="space-y-2">
                {project.challenges.map((challenge, idx) => (
                  <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: project.theme.primary }}>
                      •
                    </span>
                    <span className="flex-1 leading-relaxed">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* CTA Buttons */}
          <div className="space-y-2.5 pt-1">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 rounded-full text-white font-bold text-center text-sm shadow-lg transition-all active:scale-95"
                style={{ backgroundColor: project.theme.primary }}
              >
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 rounded-full font-bold text-center text-sm bg-white shadow-sm transition-all active:scale-95"
                style={{
                  color: project.theme.primary,
                  border: `2px solid ${project.theme.primary}`,
                }}
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}