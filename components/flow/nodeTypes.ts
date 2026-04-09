import BaseNode from "./nodes/BaseNode";
import type { NodeTypes } from "@xyflow/react";

export const nodeTypes: NodeTypes = {
  api:     BaseNode,
  db:      BaseNode,
  cache:   BaseNode,
  service: BaseNode,
  client:  BaseNode,
  queue:   BaseNode,
  auth:    BaseNode,
  storage: BaseNode,
};