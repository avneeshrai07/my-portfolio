export interface Metric {
  label: string;
  value: string;
  icon?: string;
}

export interface Challenge {
  problem: string;
  solution: string;
  result: string;
}

export interface CTAItem {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

export interface ProjectConfig {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  flow: FlowConfig;
  metrics: Metric[];
  challenges: Challenge[];
  cta: CTAItem[];
  badge?: string;
  status?: "live" | "wip" | "archived";
}

export interface FlowConfig {
  nodes: FlowNodeConfig[];
  edges: FlowEdgeConfig[];
}

export interface FlowNodeConfig {
  id: string;
  type: NodeVariant;
  label: string;
  sublabel?: string;
  status?: NodeStatus;
  position: { x: number; y: number } | PositionPreset;
}

export type FlowEdgeConfig =
  | [string, string]
  | { source: string; target: string; label?: string; animated?: boolean };

export type NodeVariant =
  | "api"
  | "db"
  | "cache"
  | "service"
  | "client"
  | "queue"
  | "auth"
  | "storage";

export type NodeStatus = "healthy" | "slow" | "error" | "idle";

export type PositionPreset =
  | "top"
  | "center"
  | "left"
  | "right"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";