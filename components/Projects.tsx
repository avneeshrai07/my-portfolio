// components/Projects.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from "@/data/projects.json";
import { Safari } from "@/components/ui/safari";
import { Iphone } from "@/components/ui/iphone";

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
  images: {
    desktop: string;
    mobile: string;
  };
  metrics: ProjectMetric[];
  challenges: string[];
  demoUrl?: string;
  githubUrl?: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    
    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    cards.forEach((card, index) => {
      // Pin each card except the last one
      if (index < cards.length - 1) {
        ScrollTrigger.create({
          trigger: card,
          start: "top 5vh",
          end: () => `+=${card.offsetHeight + 50}`,
          pin: true,
          pinSpacing: false,
          markers: false, // Set to true for debugging
          id: `pin-${index}`,
        });

        // Scale down and fade previous cards as next card approaches
        gsap.fromTo(
          card,
          {
            scale: 1,
            opacity: 1,
          },
          {
            scale: 0.9,
            opacity: 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top bottom",
              end: "top 5vh",
              scrub: 0.5,
              markers: false, // Set to true for debugging
              id: `scale-${index}`,
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="relative py-[5vh] bg-gradient-to-b from-gray-50 to-white min-h-screen">
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

        <div ref={containerRef} className="relative">
          {(projectsData as Project[]).map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="mb-[5vh] last:mb-0"
              style={{
                willChange: "transform, opacity",
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div 
      className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-shadow duration-300 hover:shadow-3xl"
      style={{ 
        height: "90vh",
        minHeight: "600px",
      }}
    >
      {/* Rest of your ProjectCard code remains exactly the same */}
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col h-full">
        {/* Hero Banner - 18% of card height */}
        <div className="relative h-[18%] flex-shrink-0 overflow-hidden rounded-t-[2.5rem]">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20" />
          <div className="absolute top-[1vh] right-[2vw] text-right">
            <p
              className="text-white uppercase tracking-[0.3em] mb-[0.5vh] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ fontSize: "clamp(0.65rem, 0.9vh, 0.85rem)" }}
            >
              {project.tagline}
            </p>
            <h3
              className="text-white font-bold tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              style={{ fontSize: "clamp(2rem, 4vh, 3.5rem)" }}
            >
              {project.title.split(" ")[0].toUpperCase()}
            </h3>
          </div>
        </div>

        {/* Content Grid - 82% of card height */}
        <div
          className="grid grid-cols-2 gap-0 flex-1 min-h-0 overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${project.theme.secondary} 0%, ${project.theme.secondary} 100%)`,
            height: "82%",
          }}
        >
          {/* Left Column - WITH GUARANTEED BUTTON SPACE */}
          <div
            className="flex flex-col h-full overflow-hidden"
            style={{ padding: "clamp(1.5rem, 2.5vh, 2.5rem)" }}
          >
            {/* Scrollable Content Area - CALCULATED HEIGHT */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden pr-3 pb-2 hide-scrollbar"
              style={{
                height: "calc(100% - 80px)",
                minHeight: 0,
              }}
            >
              <div className="space-y-[2vh]">
                {/* Title */}
                <h4
                  className="font-bold leading-tight"
                  style={{
                    color: project.theme.accent,
                    fontSize: "clamp(1.5rem, 3vh, 2.5rem)",
                  }}
                >
                  {project.title}
                </h4>

                {/* Tech Stack */}
                <div className="space-y-[0.8vh]">
                  <div className="flex flex-wrap gap-[0.5vh]">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech.name}
                        className="rounded-full font-semibold flex items-center shadow-sm"
                        style={{
                          backgroundColor: tech.color,
                          color: "white",
                          padding:
                            "clamp(0.3rem, 0.8vh, 0.6rem) clamp(0.6rem, 1.2vh, 1rem)",
                          fontSize: "clamp(0.7rem, 1.2vh, 0.9rem)",
                          gap: "clamp(0.3rem, 0.5vh, 0.5rem)",
                        }}
                      >
                        <span
                          className="bg-white/25 rounded-full flex items-center justify-center"
                          style={{
                            width: "clamp(1rem, 1.8vh, 1.5rem)",
                            height: "clamp(1rem, 1.8vh, 1.5rem)",
                            fontSize: "clamp(0.5rem, 0.8vh, 0.7rem)",
                          }}
                        >
                          ⚛
                        </span>
                        {tech.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-[0.5vh]">
                    {project.techStack[4] && (
                      <span
                        className="rounded-full font-semibold flex items-center shadow-sm"
                        style={{
                          backgroundColor: project.techStack[4].color,
                          color: "white",
                          padding:
                            "clamp(0.3rem, 0.8vh, 0.6rem) clamp(0.6rem, 1.2vh, 1rem)",
                          fontSize: "clamp(0.7rem, 1.2vh, 0.9rem)",
                          gap: "clamp(0.3rem, 0.5vh, 0.5rem)",
                        }}
                      >
                        <span
                          className="bg-white/25 rounded-full flex items-center justify-center"
                          style={{
                            width: "clamp(1rem, 1.8vh, 1.5rem)",
                            height: "clamp(1rem, 1.8vh, 1.5rem)",
                            fontSize: "clamp(0.5rem, 0.8vh, 0.7rem)",
                          }}
                        >
                          🎨
                        </span>
                        {project.techStack[4].name}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-[0.5vh]">
                    {project.techStack.slice(5).map((tech) => (
                      <span
                        key={tech.name}
                        className="rounded-full font-semibold flex items-center shadow-sm"
                        style={{
                          backgroundColor: tech.color,
                          color: "white",
                          padding:
                            "clamp(0.3rem, 0.8vh, 0.6rem) clamp(0.6rem, 1.2vh, 1rem)",
                          fontSize: "clamp(0.7rem, 1.2vh, 0.9rem)",
                          gap: "clamp(0.3rem, 0.5vh, 0.5rem)",
                        }}
                      >
                        <span
                          className="bg-white/25 rounded-full flex items-center justify-center"
                          style={{
                            width: "clamp(1rem, 1.8vh, 1.5rem)",
                            height: "clamp(1rem, 1.8vh, 1.5rem)",
                            fontSize: "clamp(0.5rem, 0.8vh, 0.7rem)",
                          }}
                        >
                          🗄
                        </span>
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p
                  className="text-gray-800 leading-relaxed"
                  style={{ fontSize: "clamp(0.85rem, 1.4vh, 1.1rem)" }}
                >
                  {project.description}
                </p>

                {/* Key Features */}
                <div>
                  <h5
                    className="font-bold text-gray-900"
                    style={{
                      fontSize: "clamp(1rem, 1.8vh, 1.3rem)",
                      marginBottom: "clamp(0.5rem, 1vh, 0.8rem)",
                    }}
                  >
                    Key Features:
                  </h5>
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(0.3rem, 0.8vh, 0.6rem)",
                    }}
                  >
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start text-gray-800"
                      >
                        <span
                          style={{
                            marginRight: "clamp(0.5rem, 1vh, 0.8rem)",
                            fontSize: "clamp(1rem, 1.5vh, 1.2rem)",
                          }}
                        >
                          •
                        </span>
                        <span
                          style={{
                            fontSize: "clamp(0.85rem, 1.4vh, 1rem)",
                            lineHeight: "1.5",
                          }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Buttons - FIXED HEIGHT, ALWAYS VISIBLE */}
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
                    fontSize: "clamp(0.85rem, 1.4vh, 1rem)",
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
                    fontSize: "clamp(0.85rem, 1.4vh, 1rem)",
                    gap: "0.5rem",
                  }}
                >
                  <span>GitHub</span>
                  <span>⚙️</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column - SAFARI CONTAINED */}
          <div
            className="flex flex-col h-full overflow-hidden"
            style={{
              padding: "clamp(1rem, 2vh, 2rem)",
              gap: "clamp(0.8rem, 1.5vh, 1.2rem)",
            }}
          >
            {/* Safari Mockup - 60% with BIGGER size */}
            <div className="relative flex-shrink-0" style={{ height: "60%" }}>
              <div
                className="w-full h-full rounded-3xl flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: project.theme.secondary,
                  padding: "clamp(0.8rem, 1.5vh, 1.2rem)",
                }}
              >
                <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
                  <Safari
                    url="magicui.design"
                    imageSrc={project.images.desktop}
                    className="w-full h-full"
                    style={{
                      maxWidth: "60%",
                      maxHeight: "95%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Metrics and Challenges Side by Side - 45% */}
            <div className="flex gap-[1.5vh] flex-1 min-h-0 overflow-hidden">
              <div
                className="rounded-3xl shadow-lg flex-1 overflow-hidden flex flex-col"
                style={{
                  backgroundColor: project.theme.primary,
                  padding: "clamp(1rem, 2vh, 1.5rem)",
                }}
              >
                <h5
                  className="font-bold text-white flex-shrink-0"
                  style={{
                    fontSize: "clamp(0.9rem, 1.6vh, 1.2rem)",
                    marginBottom: "clamp(0.6rem, 1.2vh, 1rem)",
                  }}
                >
                  Project Metrics:
                </h5>
                <ul
                  className="flex-1 overflow-y-auto hide-scrollbar"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(0.5rem, 1vh, 0.8rem)",
                  }}
                >
                  {project.metrics.map((metric) => (
                    <li
                      key={metric.label}
                      className="flex items-center justify-between text-white"
                    >
                      <span
                        className="flex items-center"
                        style={{
                          gap: "clamp(0.3rem, 0.6vh, 0.5rem)",
                          fontSize: "clamp(0.75rem, 1.3vh, 0.95rem)",
                        }}
                      >
                        <span>•</span>
                        <span>{metric.label}</span>
                      </span>
                      <span
                        className="font-bold"
                        style={{ fontSize: "clamp(1.1rem, 2vh, 1.5rem)" }}
                      >
                        {metric.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges Card - Right */}
              <div
                className="rounded-3xl bg-white shadow-lg flex-1 overflow-hidden flex flex-col"
                style={{ padding: "clamp(1rem, 2vh, 1.5rem)" }}
              >
                <h5
                  className="font-bold text-gray-900 flex-shrink-0"
                  style={{
                    fontSize: "clamp(0.9rem, 1.6vh, 1.2rem)",
                    marginBottom: "clamp(0.6rem, 1.2vh, 1rem)",
                  }}
                >
                  Challenges & Solutions:
                </h5>
                <ul
                  className="flex-1 overflow-y-auto hide-scrollbar"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(0.4rem, 0.8vh, 0.6rem)",
                  }}
                >
                  {project.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start text-gray-800">
                      <span
                        style={{
                          marginRight: "clamp(0.3rem, 0.6vh, 0.5rem)",
                          fontSize: "clamp(0.75rem, 1.3vh, 0.95rem)",
                        }}
                      >
                        •
                      </span>
                      <span
                        style={{
                          fontSize: "clamp(0.7rem, 1.2vh, 0.85rem)",
                          lineHeight: "1.5",
                        }}
                      >
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

      {/* Mobile Layout */}
      <div className="flex lg:hidden flex-col h-full overflow-y-auto hide-scrollbar">
        {/* Hero Banner */}
        <div className="relative h-56 flex-shrink-0">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white text-xs uppercase tracking-[0.2em] mb-2 drop-shadow-lg font-medium opacity-90">
              {project.tagline}
            </p>
            <h3 className="text-white text-4xl font-bold drop-shadow-2xl leading-tight">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Content Area */}
        <div
          className="p-6 space-y-6"
          style={{ backgroundColor: project.theme.secondary }}
        >
          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech.name}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-md flex items-center gap-1.5"
                  style={{ backgroundColor: tech.color }}
                >
                  <span className="text-[10px]">⚡</span>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide">
              About
            </h4>
            <p className="text-gray-800 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Visual Preview */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">
              Preview
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory">
              {/* Safari Desktop Mockup */}
              <div className="flex-shrink-0 snap-center">
                <Safari
                  url="project.demo"
                  imageSrc={project.images.desktop}
                  className="w-[280px]"
                />
              </div>
              {/* iPhone Mockup */}
              <div className="flex-shrink-0 snap-center">
                <Iphone
                  src={project.images.mobile}
                  className="w-[140px]"
                />
              </div>
            </div>
          </div>

          {/* Key Features Accordion */}
          <details className="group bg-white rounded-2xl shadow-md overflow-hidden">
            <summary className="flex justify-between items-center p-4 cursor-pointer font-bold text-gray-900 select-none">
              <span className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span>Key Features</span>
              </span>
              <span className="transform transition-transform duration-300 group-open:rotate-180 text-gray-400">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-5 border-t border-gray-100">
              <ul className="space-y-3 mt-4">
                {project.features.map((feature) => (
                  <li key={feature} className="text-sm text-gray-800 flex items-start gap-3">
                    <span className="text-base mt-0.5" style={{ color: project.theme.primary }}>
                      ●
                    </span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* Project Metrics Card */}
          <div
            className="rounded-2xl p-5 shadow-lg"
            style={{ backgroundColor: project.theme.primary }}
          >
            <h4 className="font-bold text-white mb-4 text-base flex items-center gap-2">
              <span className="text-xl">📊</span>
              <span>Project Metrics</span>
            </h4>
            <div className="space-y-3">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex justify-between items-center text-white bg-white/10 rounded-xl p-3"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span className="text-xs opacity-75">•</span>
                    {metric.label}
                  </span>
                  <span className="font-bold text-xl">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges Accordion */}
          <details className="group bg-white rounded-2xl shadow-md overflow-hidden">
            <summary className="flex justify-between items-center p-4 cursor-pointer font-bold text-gray-900 select-none">
              <span className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span>Challenges & Solutions</span>
              </span>
              <span className="transform transition-transform duration-300 group-open:rotate-180 text-gray-400">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-5 border-t border-gray-100">
              <ul className="space-y-3 mt-4">
                {project.challenges.map((challenge, idx) => (
                  <li key={idx} className="text-sm text-gray-800 flex items-start gap-3">
                    <span className="text-base mt-0.5" style={{ color: project.theme.accent }}>
                      ●
                    </span>
                    <span className="flex-1">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 rounded-2xl text-white font-bold text-center shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: project.theme.primary }}
              >
                <span>View Live Demo</span>
                <span className="text-xl">🚀</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 rounded-2xl font-bold text-center bg-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{
                  color: project.theme.accent,
                  border: `2px solid ${project.theme.accent}`,
                }}
              >
                <span>View Source Code</span>
                <span className="text-xl">⚙️</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
