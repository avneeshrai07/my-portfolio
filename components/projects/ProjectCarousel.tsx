"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import type { ProjectConfig } from "@/types/project";

interface ProjectCarouselProps {
  projects: ProjectConfig[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () => setCurrent((i) => Math.min(projects.length - 1, i + 1));

  const hasPrev = current > 0;
  const hasNext = current < projects.length - 1;

  return (
    <div className="relative flex items-center gap-3 w-full">

      {/* ── Left Arrow ── */}
      <button
        onClick={prev}
        disabled={!hasPrev}
        aria-label="Previous project"
        className={[
          "shrink-0 w-10 h-10 rounded-full border flex items-center justify-center",
          "backdrop-blur-sm transition-all duration-200",
          hasPrev
            ? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30 hover:scale-110"
            : "border-white/5 bg-transparent text-white/15 cursor-not-allowed",
        ].join(" ")}
      >
        ←
      </button>

      {/* ── Card ── */}
      <div className="flex-1 min-w-0">
        <ProjectCard project={projects[current]} />
      </div>

      {/* ── Right Arrow ── */}
      <button
        onClick={next}
        disabled={!hasNext}
        aria-label="Next project"
        className={[
          "shrink-0 w-10 h-10 rounded-full border flex items-center justify-center",
          "backdrop-blur-sm transition-all duration-200",
          hasNext
            ? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30 hover:scale-110"
            : "border-white/5 bg-transparent text-white/15 cursor-not-allowed",
        ].join(" ")}
      >
        →
      </button>

      {/* ── Dot indicators ── */}
      {projects.length > 1 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to project ${i + 1}`}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                i === current
                  ? "w-5 bg-pink-400"
                  : "w-1.5 bg-white/20 hover:bg-white/40",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}