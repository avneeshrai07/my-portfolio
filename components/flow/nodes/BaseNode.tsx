"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import type { BaseNodeData } from "@/types/flow";
import type { NodeVariant, NodeStatus } from "@/types/project";

// ─── Variant Config ────────────────────────────────────────────────────────
interface VariantStyle {
  border: string;
  glow: string;
  icon: string;
  bg: string;
  label: string;
}

const VARIANTS: Record<NodeVariant, VariantStyle> = {
  api: {
    border: "border-pink-500/60",
    glow:   "shadow-pink-500/25",
    bg:     "bg-pink-950/40",
    icon:   "⚡",
    label:  "API",
  },
  db: {
    border: "border-sky-500/60",
    glow:   "shadow-sky-500/25",
    bg:     "bg-sky-950/40",
    icon:   "🗄️",
    label:  "DB",
  },
  cache: {
    border: "border-orange-400/60",
    glow:   "shadow-orange-400/25",
    bg:     "bg-orange-950/40",
    icon:   "⚡",
    label:  "Cache",
  },
  service: {
    border: "border-violet-500/60",
    glow:   "shadow-violet-500/25",
    bg:     "bg-violet-950/40",
    icon:   "🔧",
    label:  "Service",
  },
  client: {
    border: "border-slate-400/60",
    glow:   "shadow-slate-400/20",
    bg:     "bg-slate-800/40",
    icon:   "💻",
    label:  "Client",
  },
  queue: {
    border: "border-yellow-400/60",
    glow:   "shadow-yellow-400/25",
    bg:     "bg-yellow-950/40",
    icon:   "📬",
    label:  "Queue",
  },
  auth: {
    border: "border-emerald-500/60",
    glow:   "shadow-emerald-500/25",
    bg:     "bg-emerald-950/40",
    icon:   "🔐",
    label:  "Auth",
  },
  storage: {
    border: "border-cyan-400/60",
    glow:   "shadow-cyan-400/25",
    bg:     "bg-cyan-950/40",
    icon:   "📦",
    label:  "Storage",
  },
};

// ─── Status Config ─────────────────────────────────────────────────────────
const STATUS_DOT: Record<NodeStatus, string> = {
  healthy: "bg-emerald-400 shadow-emerald-400/60",
  slow:    "bg-yellow-400 shadow-yellow-400/60",
  error:   "bg-red-500 shadow-red-500/60",
  idle:    "bg-slate-500",
};

// ─── Component ─────────────────────────────────────────────────────────────
function BaseNode({ data, selected }: NodeProps & { data: BaseNodeData }) {
  const v = VARIANTS[data.variant] ?? VARIANTS["service"];
  const statusDot = data.status ? STATUS_DOT[data.status] : null;

  return (
    <div
      className={[
        "relative min-w-[130px] rounded-xl border px-4 py-3 text-center",
        "backdrop-blur-sm shadow-lg transition-all duration-200",
        v.border,
        v.bg,
        v.glow,
        selected
          ? "ring-2 ring-white/30 scale-105 shadow-xl"
          : "hover:scale-[1.03] hover:shadow-xl",
      ].join(" ")}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-white/30 !border-white/20 hover:!bg-white/60 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-white/30 !border-white/20 hover:!bg-white/60 transition-colors"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!w-2.5 !h-2.5 !bg-white/30 !border-white/20 hover:!bg-white/60 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!w-2.5 !h-2.5 !bg-white/30 !border-white/20 hover:!bg-white/60 transition-colors"
      />

      {/* Status dot */}
      {statusDot && (
        <span
          className={[
            "absolute top-2 right-2 w-2 h-2 rounded-full shadow-md",
            statusDot,
          ].join(" ")}
        />
      )}

      {/* Icon */}
      <div className="text-xl mb-1 leading-none select-none">{v.icon}</div>

      {/* Type Badge */}
      <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-mono">
        {v.label}
      </div>

      {/* Label */}
      <div className="text-xs font-semibold text-white/90 leading-tight">
        {data.label}
      </div>

      {/* Sublabel */}
      {data.sublabel && (
        <div className="text-[10px] text-white/40 mt-0.5 leading-tight">
          {data.sublabel}
        </div>
      )}
    </div>
  );
}

export default memo(BaseNode);