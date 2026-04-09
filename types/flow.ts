import type { Node, Edge } from "@xyflow/react";
import type { NodeVariant, NodeStatus } from "./project";

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  sublabel?: string;
  variant: NodeVariant;
  status?: NodeStatus;
}

export type AppNode = Node<BaseNodeData>;

export type AppEdge = Edge;

export interface BuiltFlow {
  nodes: AppNode[];
  edges: AppEdge[];
}