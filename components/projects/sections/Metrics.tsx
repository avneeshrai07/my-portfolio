import type { Metric } from "@/types/project";

interface MetricsProps {
  metrics: Metric[];
}

export default function Metrics({ metrics }: MetricsProps) {
  if (!metrics.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-[11px] uppercase tracking-widest text-white/30 font-mono mb-3">
        Metrics
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 backdrop-blur-sm hover:border-pink-500/20 hover:bg-pink-500/5 transition-all"
          >
            {m.icon && <div className="text-lg mb-1">{m.icon}</div>}
            <div className="text-xl font-bold text-white leading-none mb-1">
              {m.value}
            </div>
            <div className="text-[10px] text-white/40 font-mono uppercase tracking-wide">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}