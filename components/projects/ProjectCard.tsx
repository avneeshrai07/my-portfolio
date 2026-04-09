import type { ProjectConfig } from "@/types/project";
import { buildFlow } from "@/lib/flow/buildFlow";
import Header from "./sections/Header";
import Metrics from "./sections/Metrics";
import Challenges from "./sections/Challenges";
import CTA from "./sections/CTA";
import FlowCanvas from "@/components/flow/FlowCanvas";

interface ProjectCardProps {
  project: ProjectConfig;
  className?: string;
}

export default function ProjectCard({ project, className = "" }: ProjectCardProps) {
  console.log("ProjectCard received project:", project);      // ← add
  console.log("ProjectCard project.flow:", project?.flow); 
  const { nodes, edges } = buildFlow(project.flow);

  return (
    <article
      className={[
        "relative rounded-2xl border border-white/10 bg-slate-900/60",
        "backdrop-blur-md p-6 shadow-2xl shadow-black/40",
        "hover:border-white/15 transition-colors duration-300",
        className,
      ].join(" ")}
    >
      {/* Subtle top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent rounded-t-2xl" />

      <Header
        project={{
          title: project.title,
          description: project.description,
          techStack: project.techStack,
          badge: project.badge,
          status: project.status,
        }}
      />

      {/* Flow Canvas — fully editable */}
      <div className="mt-2">
        <h3 className="text-[11px] uppercase tracking-widest text-white/30 font-mono mb-3">
          System Flow
        </h3>
        <FlowCanvas initialNodes={nodes} initialEdges={edges} />
      </div>

      <Metrics metrics={project.metrics} />
      <Challenges challenges={project.challenges} />
      <CTA cta={project.cta} />
    </article>
  );
}