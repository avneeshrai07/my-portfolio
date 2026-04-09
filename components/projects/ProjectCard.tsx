import type { ProjectConfig } from "@/types/project";
import { buildFlow } from "@/lib/flow/buildFlow";
import dynamic from "next/dynamic";
import Header from "./sections/Header";
import Metrics from "./sections/Metrics";
import CTA from "./sections/CTA";

const FlowCanvas = dynamic(() => import("@/components/flow/FlowCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] rounded-2xl border border-white/10 bg-slate-950/80 animate-pulse" />
  ),
});

interface ProjectCardProps {
  project: ProjectConfig;
  className?: string;
}

export default function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const { nodes, edges } = buildFlow(project.flow);

  return (
    <article
      className={[
        "relative w-full rounded-2xl border border-white/10 bg-slate-900/60",
        "backdrop-blur-md p-6 md:p-8 shadow-2xl shadow-black/40",
        "flex flex-col gap-5",
        className,
      ].join(" ")}
    >
      {/* Top gradient accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent rounded-t-2xl" />

      {/* ── Top: Header (title + description + tech stack) ── */}
      <Header
        project={{
          title: project.title,
          description: project.description,
          techStack: project.techStack,
          badge: project.badge,
          status: project.status,
        }}
      />

      {/* ── Middle: Flow Canvas ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/25 font-mono mb-2">
          System Flow
        </p>
        <FlowCanvas initialNodes={nodes} initialEdges={edges} />
      </div>

      {/* ── Bottom: Metrics left, CTA right ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <Metrics metrics={project.metrics} />
        <CTA cta={project.cta} />
      </div>
    </article>
  );
}