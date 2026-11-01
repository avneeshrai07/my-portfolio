"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { projects as PROJECTS } from "@/types/projects";
import { fluidPx } from "@/lib/fluid";

const VISIBLE_COUNT = 4;

function CornerTicks() {
  const corner = "absolute h-3 w-3 border-[color:rgba(250,245,236,0.55)]";
  return (
    <>
      <span className={`${corner} left-2.5 top-2.5 border-l-[1.5px] border-t-[1.5px]`} />
      <span className={`${corner} right-2.5 top-2.5 border-r-[1.5px] border-t-[1.5px]`} />
      <span className={`${corner} bottom-2.5 left-2.5 border-b-[1.5px] border-l-[1.5px]`} />
      <span className={`${corner} bottom-2.5 right-2.5 border-b-[1.5px] border-r-[1.5px]`} />
    </>
  );
}

function Flagship({ project }: { project: (typeof PROJECTS)[number] }) {
  const href = project.href || `/projects/${project.id}`;
  const isLive = project.status === "Production";
  const readout = project.metrics.filter((m) => m.highlight).slice(0, 2);
  const chips = project.stack.slice(0, 4);

  return (
    <div
      key={project.id}
      className="grid shrink-0 grid-cols-1 overflow-hidden rounded-[10px] md:grid-cols-[0.9fr_1.1fr]"
      style={{
        background: "#FAF5EC",
        border: "1px solid var(--proj-border-2, #D4B896)",
        boxShadow: "0 1px 2px rgba(81,55,32,0.06), 0 20px 40px -20px rgba(81,55,32,0.28)",
      }}
    >
      <Link
        href={href}
        aria-label={`View ${project.name}`}
        className="relative aspect-[16/9] w-full overflow-hidden md:aspect-auto"
        style={{ background: "linear-gradient(145deg, var(--proj-sand, #EDE0CC), var(--proj-sand-2, #E0CEB0))" }}
      >
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, 44vw"
          className="animate-fade-in object-cover"
          priority
        />
        <div className="thumb-grain absolute inset-0" />
        <CornerTicks />
      </Link>

      <div className="animate-fade-in flex flex-col justify-center gap-2.5 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[clamp(0.7188rem,0.3649rem_+_0.4423vw,0.8625rem)]">
          {isLive && (
            <span
              aria-label="Live in production"
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: "#5A9A30" }}
            />
          )}
          <span style={{ color: "var(--proj-terra, #C4694A)" }}>{project.category}</span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <span aria-hidden style={{ color: "var(--proj-border, #C8A870)" }}>/</span>
            <span style={{ color: "var(--proj-bark-3, #9A6A48)" }}>{project.year}</span>
          </span>
        </div>

        <Link href={href}>
          <h3
            className="font-super-heading font-semibold leading-tight transition-colors hover:text-[color:var(--proj-terra,#C4694A)]"
            style={{ fontSize: fluidPx(23), color: "var(--proj-ink, #1E0E04)" }}
          >
            {project.name}
          </h3>
        </Link>

        <p className="line-clamp-2 max-w-[54ch] text-[clamp(0.8125rem,0.4125rem_+_0.5vw,0.975rem)] leading-[1.55]" style={{ color: "var(--proj-ink-2, #3A2010)" }}>
          {project.sub}
        </p>

        {readout.length > 0 && (
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {readout.map((m, i) => (
              <div
                key={m.label}
                className="flex flex-wrap items-baseline gap-x-2"
                style={{ borderLeft: i === 0 ? "none" : "1px solid var(--proj-border-2, #D4B896)", paddingLeft: i === 0 ? 0 : fluidPx(20) }}
              >
                <span className="whitespace-nowrap font-semibold" style={{ fontSize: fluidPx(14), color: "var(--proj-ink, #1E0E04)" }}>
                  {m.value}
                </span>
                <span style={{ fontSize: fluidPx(11), color: "var(--proj-bark-3, #9A6A48)" }}>{m.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {chips.map((name) => (
            <span
              key={name}
              className="rounded-full px-2.5 py-0.5 text-[clamp(0.625rem,0.3173rem_+_0.3846vw,0.75rem)]"
              style={{ background: "var(--proj-sand, #EDE0CC)", color: "var(--proj-ink-3, #5A3E28)" }}
            >
              {name}
            </span>
          ))}
        </div>

        <div className="mt-0.5 flex items-center gap-4">
          <Link
            href={href}
            className="group/cta inline-flex items-center gap-1.5 text-[clamp(0.8125rem,0.4125rem_+_0.5vw,0.975rem)] font-medium"
            style={{ color: "var(--suit-brown, #513720)" }}
          >
            <span className="border-b pb-px" style={{ borderColor: "var(--proj-border, #C8A870)" }}>
              Read the case study
            </span>
            <ArrowUpRight size={14} strokeWidth={2.2} className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} source on GitHub`}
              className="inline-flex items-center gap-1.5 text-[clamp(0.7812rem,0.3966rem_+_0.4808vw,0.9375rem)] transition-colors hover:text-[color:var(--suit-brown,#513720)]"
              style={{ color: "var(--proj-bark-3, #9A6A48)" }}
            >
              <Github size={14} strokeWidth={1.9} />
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Tile({ project, isActive, onEnter, onLeave }: {
  project: (typeof PROJECTS)[number];
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const href = project.href || `/projects/${project.id}`;
  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="group relative flex flex-col overflow-hidden rounded-[8px] transition-all duration-300 ease-out"
      style={{
        background: "#FAF5EC",
        border: `1px solid ${isActive ? "var(--proj-terra, #C4694A)" : "var(--proj-border-2, #D4B896)"}`,
        transform: isActive ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isActive
          ? "0 16px 28px -14px rgba(196,105,74,0.38)"
          : "0 1px 2px rgba(81,55,32,0.05), 0 8px 18px -12px rgba(81,55,32,0.18)",
      }}
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 640px) 50vw, 360px"
          className="object-cover grayscale-[45%] transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
        />
        <div className="thumb-grain absolute inset-0" />
        <span
          className="absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: "rgba(250,245,236,0.94)" }}
        >
          <ArrowUpRight size={13} strokeWidth={2.4} style={{ color: "var(--suit-brown, #513720)" }} />
        </span>
      </div>
      <div className="flex shrink-0 flex-col gap-1.5 p-4">
        <span className="truncate text-[clamp(0.6875rem,0.349rem_+_0.4231vw,0.825rem)]" style={{ color: "var(--proj-bark-3, #9A6A48)" }}>
          {project.category}
        </span>
        <span
          className="truncate font-super-heading font-semibold"
          style={{ fontSize: fluidPx(16.5), color: "var(--proj-ink, #1E0E04)" }}
        >
          {project.name}
        </span>
      </div>
    </Link>
  );
}

export default function ProjectShowcase() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const [showAll, setShowAll] = useState(false);
  const active = PROJECTS.find((p) => p.id === activeId) ?? PROJECTS[0];
  const reset = () => setActiveId(PROJECTS[0].id);

  const visible = showAll ? PROJECTS : PROJECTS.slice(0, VISIBLE_COUNT);
  const hiddenCount = PROJECTS.length - VISIBLE_COUNT;

  return (
    <div className="flex flex-col gap-6">
      {/* Flagship + row, centered within a full screen on desktop when
          collapsed — the cards keep their own proportions; the extra
          height (if any) becomes even padding above/below, not distortion. */}
      <div className={`flex flex-col justify-center gap-6 ${!showAll ? "lg:min-h-screen" : ""}`}>
        <Flagship project={active} />

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((project) => (
            <Tile
              key={project.id}
              project={project}
              isActive={project.id === activeId}
              onEnter={() => setActiveId(project.id)}
              onLeave={reset}
            />
          ))}
        </div>
      </div>

      {!showAll ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mx-auto flex items-center gap-1.5 text-[clamp(0.7812rem,0.3966rem_+_0.4808vw,0.9375rem)]"
          style={{ color: "var(--proj-bark-3, #9A6A48)" }}
        >
          + {hiddenCount} more systems — <span style={{ color: "var(--proj-terra, #C4694A)" }}>show all</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="mx-auto flex items-center gap-1.5 text-[clamp(0.7812rem,0.3966rem_+_0.4808vw,0.9375rem)]"
          style={{ color: "var(--proj-bark-3, #9A6A48)" }}
        >
          Show fewer
        </button>
      )}
    </div>
  );
}
