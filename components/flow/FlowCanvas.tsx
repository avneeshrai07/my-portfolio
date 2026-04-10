"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  // MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Connection,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "./nodeTypes";
import type { AppNode, AppEdge } from "@/types/flow";

interface FlowCanvasProps {
  initialNodes: AppNode[];
  initialEdges: AppEdge[];
  className?: string;
}

export default function FlowCanvas({
  initialNodes,
  initialEdges,
  className = "",
}: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>(initialEdges);
  const [isEditing, setIsEditing] = useState(false);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            type: "smoothstep",
            style: { strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const handleReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div
      style={{ width: "100%", height: "100%", minHeight: "320px" }}
      className={[
        "rounded-2xl overflow-hidden",
        "border border-white/10 bg-[var(--secondary-dark)]",
        className,
      ].join(" ")}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        deleteKeyCode={isEditing ? "Backspace" : null}
        nodesDraggable={isEditing}
        nodesConnectable={isEditing}
        elementsSelectable={isEditing}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          className="!opacity-20"
        />

        <Controls className="!bg-slate-900/80 !border-white/10 !rounded-xl !shadow-xl [&>button]:!text-white/60 [&>button:hover]:!text-white [&>button]:!bg-transparent [&>button]:!border-white/10" />

        {/* <MiniMap
          nodeStrokeWidth={3}
          className="!bg-slate-900/80 !border-white/10 !rounded-xl !overflow-hidden"
          nodeColor={(n: Node) => {
            const colorMap: Record<string, string> = {
              api: "#ec4899", db: "#38bdf8", cache: "#fb923c",
              service: "#a78bfa", client: "#94a3b8",
              queue: "#facc15", auth: "#34d399", storage: "#22d3ee",
            };
            return colorMap[n.type ?? "service"] ?? "#94a3b8";
          }}
        /> */}

        <Panel position="top-right" className="flex gap-2">
          <button
            onClick={() => setIsEditing((value) => !value)}
            className={[
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              "border backdrop-blur-sm",
              isEditing
                ? "bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-lg shadow-pink-500/20"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10",
            ].join(" ")}
          >
            {isEditing ? "✏️ Editing" : "🔒 View"}
          </button>

          {isEditing && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              ↺ Reset
            </button>
          )}
        </Panel>

        {isEditing && (
          <Panel position="bottom-left">
            <p className="text-[10px] text-white/30 font-mono">
              Drag nodes · Connect handles · Backspace to delete
            </p>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
