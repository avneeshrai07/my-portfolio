import type { Metric } from "@/types/project";

interface MetricsProps {
  metrics: Metric[];
}

export default function Metrics({ metrics }: MetricsProps) {
  if (!metrics.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2 backdrop-blur-sm hover:border-pink-500/20 hover:bg-pink-500/5 transition-all"
        >
          {m.icon && <span className="text-base leading-none">{m.icon}</span>}
          <div>
            <div className="text-sm font-bold text-white leading-none">{m.value}</div>
            <div className="text-[9px] text-white/35 font-mono uppercase tracking-wide mt-0.5">
              {m.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}