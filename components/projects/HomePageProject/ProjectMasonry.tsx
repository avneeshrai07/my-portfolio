"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects as PROJECTS } from "@/types/projects";
import type { Project } from "@/types/projects";

/* Bounded, cycling image heights (px). Wider spread + shortest-column placement
   gives the real masonry stagger. Index 1 = min, index 3 = max (reference
   projects); the rest fall in between and the pattern repeats. */
const IMG_MIN = 170;
const IMG_MAX = 340;
const IMG_HEIGHTS = [250, IMG_MIN, 300, IMG_MAX, 205, 285];
const MAX_CHIPS = 3;
const GAP = 20;

function Pin({ project, index, imgHeight }: { project: Project; index: number; imgHeight: number }) {
  const isLive = project.status === "Production";
  const href = project.href || `/projects/${project.id}`;
  const num = String(index + 1).padStart(2, "0");
  const chips = project.stack.slice(0, MAX_CHIPS);

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{ background: "#fff", border: "1px solid #EADFC9", boxShadow: "0 1px 2px rgba(81,55,32,0.05)" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: imgHeight }}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isLive && (
          <span
            className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold"
            style={{ background: "rgba(255,255,255,0.92)", color: "#3A6820" }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#5A9A30", animation: "pf-pulse 2s ease-in-out infinite" }}
            />
            Live
          </span>
        )}
        <span
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: "var(--proj-terra, #C4694A)", color: "#fff" }}
        >
          View <ArrowUpRight size={13} strokeWidth={2.4} />
        </span>
        <span
          className="absolute bottom-3 right-3 rounded-full px-2 py-0.5 font-heading text-[10px] tracking-[0.05em]"
          style={{ background: "rgba(0,0,0,0.28)", color: "rgba(255,255,255,0.85)" }}
        >
          {num} / {String(PROJECTS.length).padStart(2, "0")}
        </span>
      </div>

      {/* Caption */}
      <div className="p-4 pt-3.5">
        <div className="mb-1 font-heading text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--proj-bark-3, #9A6A48)" }}>
          {project.category}
        </div>
        <h3
          className="mb-1.5 text-[15px] font-semibold leading-snug transition-colors group-hover:text-[color:var(--proj-terra,#C4694A)]"
          style={{ color: "var(--proj-ink, #1E0E04)", letterSpacing: "-0.01em" }}
        >
          {project.name}
        </h3>
        <p className="text-[12.5px] leading-[1.55]" style={{ color: "var(--proj-ink-3, #5A3E28)" }}>
          {project.sub}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((name) => (
            <span
              key={name}
              className="rounded-full px-2 py-0.5 text-[10px]"
              style={{ background: "#F1E7D4", color: "#5A3E28", border: "1px solid var(--proj-border, #C8A870)" }}
            >
              {name}
            </span>
          ))}
          {project.stack.length > MAX_CHIPS && (
            <span className="px-1 py-0.5 text-[10px]" style={{ color: "var(--proj-bark-3, #9A6A48)" }}>
              +{project.stack.length - MAX_CHIPS}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* Estimate a card's rendered height so we can pack into the shortest column. */
function estHeight(project: Project, imgHeight: number, colW: number): number {
  const charsPerLine = Math.max(16, colW / 6.4);
  const descLines = Math.ceil(project.sub.length / charsPerLine);
  const captionH = 92 + descLines * 19; // category + title + chips + padding
  return imgHeight + captionH;
}

export default function ProjectMasonry() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const measure = () => setWidth(ref.current?.clientWidth ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const effW = width || 1100;
  const cols = effW < 560 ? 1 : effW < 860 ? 2 : 3;
  const colW = (effW - GAP * (cols - 1)) / cols;

  const heights = Array(cols).fill(0);
  const buckets: { p: Project; i: number; imgH: number }[][] = Array.from({ length: cols }, () => []);
  PROJECTS.forEach((p, i) => {
    const imgH = IMG_HEIGHTS[i % IMG_HEIGHTS.length];
    let shortest = 0;
    for (let c = 1; c < cols; c++) if (heights[c] < heights[shortest]) shortest = c;
    heights[shortest] += estHeight(p, imgH, colW) + GAP;
    buckets[shortest].push({ p, i, imgH });
  });

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="flex items-start" style={{ gap: GAP }}>
        {buckets.map((bucket, ci) => (
          <div key={ci} className="flex min-w-0 flex-1 flex-col" style={{ gap: GAP }}>
            {bucket.map(({ p, i, imgH }) => (
              <Pin key={p.id} project={p} index={i} imgHeight={imgH} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
