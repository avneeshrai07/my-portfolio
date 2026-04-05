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

// // ─────────────────── Phone Frame ───────────────────
// function PhoneFrame({ src, className }: { src: string; className?: string }) {
//   return (
//     <div
//       className={`relative flex-shrink-0 ${className ?? ""}`}
//       style={{ aspectRatio: "9 / 19.5" }}
//     >
//       <div
//         className="absolute overflow-hidden"
//         style={{
//           top: "3.5%",
//           left: "5%",
//           right: "5%",
//           bottom: "3.5%",
//           borderRadius: "12px",
//           zIndex: 0,
//         }}
//       >
//         <img
//           src={src}
//           alt="Mobile preview"
//           className="w-full h-full object-cover object-top"
//         />
//       </div>
//       <svg
//         className="absolute inset-0 w-full h-full pointer-events-none select-none"
//         viewBox="0 0 90 195"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         style={{ zIndex: 1 }}
//       >
//         <rect x="1.5" y="1.5" width="87" height="192" rx="14.5" fill="none" stroke="#1a1a1a" strokeWidth="3" />
//         <rect x="0" y="52" width="2.5" height="22" rx="1.25" fill="#2a2a2a" />
//         <rect x="0" y="80" width="2.5" height="22" rx="1.25" fill="#2a2a2a" />
//         <rect x="87.5" y="66" width="2.5" height="32" rx="1.25" fill="#2a2a2a" />
//         <rect x="32" y="6" width="26" height="7" rx="3.5" fill="#1a1a1a" />
//         <rect x="33" y="184" width="24" height="3" rx="1.5" fill="#1a1a1a" opacity="0.4" />
//       </svg>
//     </div>
//   );
// }

// // ─────────────────── Tablet Frame ───────────────────
// function TabletFrame({ src, className }: { src: string; className?: string }) {
//   return (
//     <div
//       className={`relative flex-shrink-0 ${className ?? ""}`}
//       style={{ aspectRatio: "3 / 4" }}
//     >
//       <div
//         className="absolute overflow-hidden"
//         style={{
//           top: "9.5%",
//           left: "7.8%",
//           right: "7.8%",
//           bottom: "9.5%",
//           borderRadius: "2px",
//           zIndex: 0,
//         }}
//       >
//         <img
//           src={src}
//           alt="Desktop preview"
//           className="w-full h-full object-cover object-top"
//         />
//       </div>
//       <div
//         className="absolute inset-0 pointer-events-none select-none"
//         style={{ zIndex: 1, borderRadius: "12px", border: "6px solid #1f2937" }}
//       />
//     </div>
//   );
// }

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
      <p className="text-sm font-bold text-gray-900 mb-1">Project Description:</p>
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

// ─────────────────── Mobile Magazine Swiper ───────────────────
function MobileProjectSwiper({ projects }: { projects: Project[] }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  // Touch tracking
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Card refs for GSAP magazine flip
  const currentCardRef = useRef<HTMLDivElement>(null);
  const nextCardRef = useRef<HTMLDivElement>(null);

  const goTo = (targetIndex: number, dir: "left" | "right") => {
    if (animating) return;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    setAnimating(true);
    setDirection(dir);

    const currentEl = currentCardRef.current;
    const nextEl = nextCardRef.current;
    if (!currentEl || !nextEl) return;

    // Pre-position the incoming card
    const fromX = dir === "left" ? "100%" : "-100%";
    const toX = dir === "left" ? "-100%" : "100%";

    gsap.set(nextEl, {
      x: fromX,
      rotateY: dir === "left" ? 15 : -15,
      opacity: 0.6,
      scale: 0.92,
      zIndex: 2,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrent(targetIndex);
        setAnimating(false);
        setDirection(null);
        // Reset both cards so state is clean for next gesture
        gsap.set([currentEl, nextEl], { clearProps: "all" });
      },
    });

    // Current card exits
    tl.to(currentEl, {
      x: toX,
      rotateY: dir === "left" ? -15 : 15,
      opacity: 0,
      scale: 0.92,
      duration: 0.42,
      ease: "power3.in",
    });

    // Next card enters (overlapping)
    tl.to(
      nextEl,
      {
        x: "0%",
        rotateY: 0,
        opacity: 1,
        scale: 1,
        duration: 0.42,
        ease: "power3.out",
      },
      "-=0.22"
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    // Only trigger if horizontal swipe dominates
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;

    if (dx < 0 && current < projects.length - 1) {
      goTo(current + 1, "left");
    } else if (dx > 0 && current > 0) {
      goTo(current - 1, "right");
    }
  };

  // The "next" project index to render offscreen
  const pendingIndex =
    direction === "left"
      ? Math.min(current + 1, projects.length - 1)
      : direction === "right"
      ? Math.max(current - 1, 0)
      : current;

  const project = projects[current];
  const pendingProject = projects[pendingIndex];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ perspective: "1200px" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Progress dots ── */}
      <div className="flex justify-center gap-1.5 mb-3">
        {projects.map((_, i) => (
          <span
            key={i}
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              backgroundColor:
                i === current ? project.theme.primary : "#d1d5db",
            }}
          />
        ))}
      </div>

      {/* ── Card stack ── */}
      <div className="relative" style={{ transformStyle: "preserve-3d" }}>
        {/* Current card */}
        <div
          ref={currentCardRef}
          style={{ position: "relative", zIndex: 1, transformStyle: "preserve-3d" }}
        >
          <MobileProjectCard project={project} />
        </div>

        {/* Pending/next card — rendered off-screen, GSAP moves it in */}
        {animating && pendingIndex !== current && (
          <div
            ref={nextCardRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              transformStyle: "preserve-3d",
            }}
          >
            <MobileProjectCard project={pendingProject} />
          </div>
        )}
      </div>

      {/* ── Swipe hint (only on first card, first load) ── */}
      {current === 0 && projects.length > 1 && (
        <p
          className="text-center text-[11px] mt-3 font-medium select-none"
          style={{ color: project.theme.accent, opacity: 0.55 }}
        >
          swipe left to next project →
        </p>
      )}
    </div>
  );
}

// ─────────────────── Mobile Project Card ───────────────────
// Extracted from ProjectCard — mobile-only, no Visual Preview / Features / Metrics / Challenges
function MobileProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <p className="absolute bottom-3 left-4 text-white text-xs font-semibold uppercase tracking-widest drop-shadow">
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

        {/* CTA Buttons */}
        <div className="flex gap-2 pt-1 flex-wrap">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] text-center py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-transform active:scale-95"
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
              className="flex-1 min-w-[120px] text-center py-2.5 rounded-xl text-sm font-semibold border transition-transform active:scale-95"
              style={{
                borderColor: project.theme.primary,
                color: project.theme.primary,
              }}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────── Main Export ───────────────────
export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const projects = projectsData as Project[];

  useEffect(() => {
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

        {/* ── DESKTOP: sticky-stack scroll ── */}
        <div
          ref={containerRef}
          className="relative hidden lg:block"
          style={{ perspective: "1400px" }}
        >
          {projects.map((project, index) => {
            const isLast = index === projects.length - 1;
            return (
              <div key={project.id} className={isLast ? "" : "pb-[0vh] lg:pb-0"}>
                <div
                  ref={(el) => { cardsRef.current[index] = el; }}
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

        {/* ── MOBILE: magazine swipe ── */}
        <div className="block lg:hidden">
          <MobileProjectSwiper projects={projects} />
        </div>
      </div>
    </section>
  );
}

// ─────────────────── Project Card (Desktop only) ───────────────────
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
      {/* ══════════════ DESKTOP LAYOUT ══════════════ */}
      <div
        className="flex flex-col"
        style={{ height: "90vh", minHeight: "600px" }}
      >
        {/* Hero Banner — 18% */}
        <div
          className="relative flex-shrink-0 overflow-hidden rounded-t-[2.5rem]"
          style={{ height: "18%" }}
        >
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
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
                  style={{
                    fontSize: "clamp(1.5rem,3vh,2.5rem)",
                    color: project.theme.primary,
                  }}
                >
                  {project.title}
                </h4>
                <div className="flex flex-wrap" style={{ gap: "clamp(0.3rem,0.6vh,0.5rem)" }}>
                  {project.techStack.map((tech) => (
                    <span
                      key={tech.name}
                      className="px-2 py-0.5 rounded-full font-semibold text-white"
                      style={{
                        backgroundColor: tech.color,
                        fontSize: "clamp(0.65rem,1.1vh,0.85rem)",
                      }}
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
                <p
                  className="text-gray-700 leading-relaxed"
                  style={{ fontSize: "clamp(0.8rem,1.4vh,1rem)" }}
                >
                  {project.description}
                </p>
                <div>
                  <h5
                    className="font-bold text-gray-900"
                    style={{
                      fontSize: "clamp(0.9rem,1.6vh,1.2rem)",
                      marginBottom: "clamp(0.4rem,0.8vh,0.6rem)",
                    }}
                  >
                    Key Features:
                  </h5>
                  <ul className="space-y-[0.8vh]">
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center text-gray-800"
                        style={{ gap: "clamp(0.3rem,0.6vh,0.5rem)" }}
                      >
                        <span style={{ color: project.theme.primary, fontSize: "clamp(0.75rem,1.3vh,0.95rem)" }}>✦</span>
                        <span style={{ fontSize: "clamp(0.75rem,1.3vh,0.95rem)" }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div
              className="flex flex-shrink-0 mt-auto pt-[1.5vh]"
              style={{ gap: "clamp(0.5rem,1vh,0.75rem)" }}
            >
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center rounded-xl font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: project.theme.primary,
                    padding: "clamp(0.5rem,1vh,0.75rem) clamp(0.75rem,1.5vh,1.25rem)",
                    fontSize: "clamp(0.75rem,1.3vh,0.95rem)",
                  }}
                >
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center rounded-xl font-semibold border transition-transform hover:scale-105 active:scale-95"
                  style={{
                    borderColor: project.theme.primary,
                    color: project.theme.primary,
                    padding: "clamp(0.5rem,1vh,0.75rem) clamp(0.75rem,1.5vh,1.25rem)",
                    fontSize: "clamp(0.75rem,1.3vh,0.95rem)",
                  }}
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Right */}
          <div
            className="flex flex-col h-full overflow-hidden"
            style={{ padding: "clamp(1.5rem,2.5vh,2.5rem)", paddingLeft: "clamp(0.75rem,1.5vh,1.25rem)" }}
          >
            {/* Safari browser mockup */}
            <div className="flex-1 min-h-0 overflow-hidden rounded-2xl shadow-xl mb-[1.5vh]">
              <Safari
                url={project.demoUrl ?? "project.demo"}
                className="w-full h-full"
                src={project.images.desktop}
              />
            </div>

            {/* Metrics */}
            <div
              className="flex-shrink-0 rounded-3xl overflow-hidden"
              style={{
                backgroundColor: project.theme.primary,
                padding: "clamp(0.75rem,1.5vh,1.25rem) clamp(1rem,2vh,1.5rem)",
                marginBottom: "clamp(0.5rem,1vh,0.75rem)",
              }}
            >
              <h5
                className="font-bold text-white"
                style={{
                  fontSize: "clamp(0.8rem,1.4vh,1.1rem)",
                  marginBottom: "clamp(0.4rem,0.8vh,0.6rem)",
                }}
              >
                Project Metrics:
              </h5>
              <ul style={{ display: "flex", flexDirection: "column", gap: "clamp(0.25rem,0.5vh,0.4rem)" }}>
                {project.metrics.map((metric) => (
                  <li
                    key={metric.label}
                    className="flex items-center justify-between text-white"
                  >
                    <span
                      className="flex items-center"
                      style={{
                        gap: "clamp(0.3rem,0.6vh,0.5rem)",
                        fontSize: "clamp(0.75rem,1.3vh,0.95rem)",
                      }}
                    >
                      <span>•</span>
                      <span>{metric.label}</span>
                    </span>
                    <span
                      className="font-bold"
                      style={{ fontSize: "clamp(1.1rem,2vh,1.5rem)" }}
                    >
                      {metric.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges & Solutions */}
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
                    <span style={{ marginRight: "clamp(0.3rem,0.6vh,0.5rem)", fontSize: "clamp(0.75rem,1.3vh,0.95rem)" }}>•</span>
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
  );
}