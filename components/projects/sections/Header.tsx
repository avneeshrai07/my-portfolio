import type { ProjectConfig } from "@/types/project";

interface HeaderProps {
  project: Pick<ProjectConfig, "title" | "description" | "techStack" | "badge" | "status">;
}

const STATUS_STYLES = {
  live:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  wip:      "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  archived: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

const STATUS_DOT = {
  live:     "bg-emerald-400 animate-pulse",
  wip:      "bg-yellow-400",
  archived: "bg-slate-500",
};

export default function Header({ project }: HeaderProps) {
  return (
    <div className="mb-6">
      {/* Badge row */}
      <div className="flex items-center gap-2 mb-3">
        {project.badge && (
          <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400/80 border border-pink-500/20 bg-pink-500/10 px-2 py-0.5 rounded-full">
            {project.badge}
          </span>
        )}
        {project.status && (
          <span
            className={[
              "flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border",
              STATUS_STYLES[project.status],
            ].join(" ")}
          >
            <span className={["w-1.5 h-1.5 rounded-full", STATUS_DOT[project.status]].join(" ")} />
            {project.status}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-2 tracking-tight leading-tight">
        {project.title}
      </h2>

      {/* Description */}
      <p className="text-sm text-white/55 leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 font-mono hover:bg-white/10 hover:text-white/80 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}