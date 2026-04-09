import type { ProjectConfig } from "@/types/project";
import { buildFlow } from "@/lib/flow/buildFlow";
import dynamic from "next/dynamic";
import Header from "./sections/Header";
import Metrics from "./sections/Metrics";
import CTA from "./sections/CTA";

const FlowCanvas = dynamic(() => import("@/components/flow/FlowCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex-1 rounded-2xl border border-white/10 bg-slate-950/80 animate-pulse" />
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
        "relative w-full flex flex-col",
        "rounded-2xl border border-white/10 bg-slate-900/60",
        "backdrop-blur-md shadow-2xl shadow-black/40",
        "p-4 md:p-5 gap-3",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent rounded-t-2xl" />

      <Header project={{ title: project.title, description: project.description, techStack: project.techStack, badge: project.badge, status: project.status }} />

      <div className="flex-1 flex flex-col min-h-0">
        <p className="text-[10px] uppercase tracking-widest text-white/25 font-mono mb-1.5">
          System Flow
        </p>
        <div style={{ height: "320px" }}>
          <FlowCanvas initialNodes={nodes} initialEdges={edges} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pt-1">
        <Metrics metrics={project.metrics} />
        <CTA cta={project.cta} />
      </div>
    </article>
  );
}