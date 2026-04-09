import type { FlowConfig, FlowNodeConfig, PositionPreset } from "@/types/project";
import type { AppNode, AppEdge, BuiltFlow } from "@/types/flow";

// ─── Position Preset Map ───────────────────────────────────────────────────
const PRESET_POSITIONS: Record<PositionPreset, { x: number; y: number }> = {
  top:          { x: 300, y: 20  },
  "top-left":   { x: 50,  y: 20  },
  "top-right":  { x: 550, y: 20  },
  left:         { x: 50,  y: 200 },
  center:       { x: 300, y: 200 },
  right:        { x: 550, y: 200 },
  "bottom-left":{ x: 50,  y: 380 },
  bottom:       { x: 300, y: 380 },
  "bottom-right":{ x: 550, y: 380 },
};

function resolvePosition(
  pos: FlowNodeConfig["position"]
): { x: number; y: number } {
  if (typeof pos === "string") {
    return PRESET_POSITIONS[pos] ?? PRESET_POSITIONS["center"];
  }
  return pos;
}

// ─── Auto-grid fallback if no positions given ──────────────────────────────
function autoGrid(index: number, total: number): { x: number; y: number } {
  const cols = Math.ceil(Math.sqrt(total));
  const col = index % cols;
  const row = Math.floor(index / cols);
  return { x: col * 200 + 60, y: row * 160 + 60 };
}

// ─── Main Builder ──────────────────────────────────────────────────────────
export function buildFlow(config: FlowConfig): BuiltFlow {
    console.log("buildFlow received:", config); 
  const nodes: AppNode[] = config.nodes.map((n, i) => ({
    id: n.id,
    type: n.type,
    position:
      n.position !== undefined
        ? resolvePosition(n.position)
        : autoGrid(i, config.nodes.length),
    data: {
      label: n.label,
      sublabel: n.sublabel,
      variant: n.type,
      status: n.status ?? "healthy",
    },
    // Allow full drag + edit in canvas
    draggable: true,
    selectable: true,
    deletable: true,
  }));

  const edges: AppEdge[] = config.edges.map((e, i) => {
    const isTuple = Array.isArray(e);
    const source = isTuple ? e[0] : e.source;
    const target = isTuple ? e[1] : e.target;
    const label  = isTuple ? undefined : e.label;
    const animated = isTuple ? true : (e.animated ?? true);

    return {
      id: `e-${source}-${target}-${i}`,
      source,
      target,
      label,
      animated,
      type: "smoothstep",
      style: { strokeWidth: 2 },
    };
  });

  return { nodes, edges };
}