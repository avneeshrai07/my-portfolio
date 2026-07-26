"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { projects as PROJECTS } from "@/types/projects";
import type { Project } from "@/types/projects";

const MAX_CHIPS = 5;

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const isLive = project.status === "Production";
  const href = project.href || `/projects/${project.id}`;
  const num = String(index + 1).padStart(2, "0");
  const chips = project.stack.slice(0, MAX_CHIPS);
  const extra = project.stack.length - chips.length;

  return (
    <article
      className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 md:flex-row"
      style={{
        background: "#FAF5EC",
        border: "1px solid var(--proj-border-2, #D4B896)",
        borderRadius: 14,
        boxShadow: "3px 4px 16px rgba(81,55,32,0.10)",
      }}
    >
      {/* Thumbnail */}
      <Link
        href={href}
        aria-label={`View ${project.name}`}
        className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden md:aspect-auto md:w-[38%] md:max-w-[320px]"
      >
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* number chip */}
        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 font-heading text-[10px] tracking-[0.06em]"
          style={{
            background: "rgba(0,0,0,0.28)",
            color: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          {num} / {String(PROJECTS.length).padStart(2, "0")}
        </span>
      </Link>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col p-6 md:p-7">
        <div className="mb-2 flex items-center gap-3">
          <span
            className="font-heading text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--proj-bark-3, #9A6A48)" }}
          >
            {project.category}
          </span>
          {isLive && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-[0.06em]"
              style={{
                background: "var(--proj-tag-live-bg, #E8F0DC)",
                color: "var(--proj-tag-live-tx, #3A6820)",
                border: "1px solid var(--proj-tag-live-bd, #B0D088)",
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "#5A9A30", animation: "pf-pulse 2s ease-in-out infinite" }}
              />
              Live
            </span>
          )}
        </div>

        <Link href={href} className="block">
          <h3
            className="text-[20px] font-bold leading-snug transition-colors group-hover:text-[color:var(--proj-terra,#C4694A)] md:text-[22px]"
            style={{ color: "var(--proj-ink, #1E0E04)", letterSpacing: "-0.01em" }}
          >
            {project.name}
          </h3>
        </Link>

        <p
          className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed"
          style={{ color: "var(--proj-ink-2, #3A2010)", opacity: 0.85 }}
        >
          {project.sub}
        </p>

        {/* Stack chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {chips.map((name) => (
            <span
              key={name}
              className="rounded-full px-2.5 py-0.5 text-[10.5px] font-medium"
              style={{
                background: "var(--proj-sand, #EDE0CC)",
                color: "var(--proj-ink-3, #5A3E28)",
                border: "1px solid var(--proj-border, #C8A870)",
              }}
            >
              {name}
            </span>
          ))}
          {extra > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-[10.5px] font-medium"
              style={{ color: "var(--proj-bark-3, #9A6A48)" }}
            >
              +{extra}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-3 pt-5">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-opacity hover:opacity-85"
            style={{ background: "var(--suit-brown, #513720)", color: "#FAF5EC" }}
          >
            View project
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[13px] font-semibold transition-colors"
              style={{ borderColor: "var(--proj-border, #C8A870)", color: "var(--suit-brown, #513720)" }}
            >
              <Github size={15} strokeWidth={1.9} />
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectCardCompact() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 md:px-0">
      {PROJECTS.map((project, i) => (
        <ProjectRow key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}
