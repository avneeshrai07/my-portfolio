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
// ─────────────────── Mobile Magazine Swiper ───────────────────
function MobileProjectSwiper({ projects }: { projects: Project[] }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);

  const slotRef = useRef<{ a: number; b: number; active: "a" | "b" }>({
    a: 0,
    b: 1 % projects.length,
    active: "a",
  });

  const [slotProjects, setSlotProjects] = useState<{ a: number; b: number }>({
    a: 0,
    b: 1 % projects.length,
  });

  const goTo = (targetIndex: number, dir: "left" | "right") => {
    if (animating) return;

    const next = ((targetIndex % projects.length) + projects.length) % projects.length;
    if (next === current) return;

    const slot = slotRef.current;
    const isActiveA = slot.active === "a";
    const standbyRef = isActiveA ? cardBRef : cardARef;
    const currentEl = isActiveA ? cardARef.current : cardBRef.current;

    setSlotProjects((prev) => ({
      ...prev,
      [isActiveA ? "b" : "a"]: next,
    }));

    if (isActiveA) slot.b = next;
    else slot.a = next;

    setAnimating(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const nextEl = standbyRef.current;
        if (!currentEl || !nextEl) { setAnimating(false); return; }

        const fromX = dir === "left" ? "100%" : "-100%";
        const exitX = dir === "left" ? "-30%" : "30%";

        gsap.set(nextEl, {
          x: fromX,
          scale: 0.96,
          opacity: 0,
          visibility: "visible",
          zIndex: 2,
        });
        gsap.set(currentEl, { zIndex: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.out", duration: 0.55 },
          onComplete: () => {
            slot.active = isActiveA ? "b" : "a";
            gsap.set(currentEl, { visibility: "hidden", clearProps: "x,scale,opacity,zIndex" });
            gsap.set(nextEl, { clearProps: "x,scale,opacity,zIndex,visibility" });
            setCurrent(next);
            setAnimating(false);
          },
        });

        tl.to(currentEl, {
          x: exitX,
          scale: 0.94,
          opacity: 0,
          duration: 0.38,
          ease: "expo.in",
        });

        tl.to(
          nextEl,
          { x: "0%", scale: 1, opacity: 1, duration: 0.55, ease: "expo.out" },
          "-=0.28"
        );
      });
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) goTo(current + 1, "left");
    else goTo(current - 1, "right");
  };

  const slot = slotRef.current;
  const activeProject = projects[current];

  return (
    <div
      className="relative w-full"
      style={{ perspective: "1200px" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative overflow-hidden rounded-[2.5rem]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Slot A */}
        <div
          ref={cardARef}
          style={{
            position: slot.active === "a" ? "relative" : "absolute",
            top: 0, left: 0, right: 0,
            zIndex: slot.active === "a" ? 1 : 0,
            visibility: slot.active === "a" ? "visible" : "hidden",
            willChange: "transform, opacity",
          }}
        >
          <MobileProjectCard project={projects[slotProjects.a]} />
        </div>

        {/* Slot B */}
        <div
          ref={cardBRef}
          style={{
            position: slot.active === "b" ? "relative" : "absolute",
            top: 0, left: 0, right: 0,
            zIndex: slot.active === "b" ? 1 : 0,
            visibility: slot.active === "b" ? "visible" : "hidden",
            willChange: "transform, opacity",
          }}
        >
          <MobileProjectCard project={projects[slotProjects.b]} />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (!animating && i !== current)
                goTo(i, i > current ? "left" : "right");
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              backgroundColor:
                i === current
                  ? activeProject.theme.primary
                  : activeProject.theme.accent,
              opacity: i === current ? 1 : 0.4,
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Swipe hint */}
      {projects.length > 1 && (
        <p
          className="text-center text-[11px] mt-2 mb-2 font-medium select-none"
          style={{ color: activeProject.theme.accent, opacity: 0.55 }}
        >
          {current === projects.length - 1
            ? "← swipe right · wraps around"
            : "swipe left for next project →"}
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
      className="bg-white rounded-[2.5rem] overflow-hidden"
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