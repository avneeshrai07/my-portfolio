// projects.ts

export type TagType = "live" | "type" | "status" | string;

export interface Tag {
  label: string;
  type: TagType;
}

export interface Feature {
  title: string;
  desc: string;
}

export interface Metric {
  value: string;
  label: string;
  highlight: boolean;
}

export type ProjectStatus = "Production" | "Development" | "Archived" | string;
export type ProjectCategory = "Machine Learning" | "WebApp" | "AI" | "Backend" | string;
export type ProjectType = "Backend System" | "Frontend App" | "Full Stack" | string;
export type DiagramType = "sunakku" | "velox" | "gatekeeper" | string;

export interface Project {
  id: string;
  num: string;
  name: string;
  category: ProjectCategory;
  href: string;
  image: string;
  status: ProjectStatus;
  year: string;
  role: string;
  type: ProjectType;
  impact: string;
  duration: string;
  sub: string;
  tags: Tag[];
  overview: string;
  problem: string;
  challenges: string[];
  decisions: string[];
  features: Feature[];
  stack: string[];
  metrics: Metric[];
  githubUrl: string;
  demoUrl: string;
  diagramType: DiagramType;
}

export const projects: Project[] = [
  {
    id: "sunakku",
    num: "01",
    name: "Sunakku",
    category: "Machine Learning",
    href: "/projects/sunakku",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/sunaaku.png`,
    status: "Production",
    year: "2025",
    role: "Solo Architecture & Engineering",
    type: "Backend System",
    impact: "Eliminated single points of failure across all notification channels at production scale.",
    duration: "3 months",
    sub: "snack ordering platform — queue-based, real-time, high-throughput",
    tags: [
      { label: "Live", type: "live" },
      { label: "BullMQ / Queue", type: "type" },
      { label: "Next.js + Node", type: "type" },
    ],
    overview:
      "A real-time snack ordering system built for high-throughput cafeteria environments. Order intake is fully decoupled from processing — the REST API stays responsive under peak kitchen load while BullMQ workers handle fulfillment asynchronously. Redis caching eliminates 94% of redundant DB reads, and atomic locks prevent race conditions on limited-stock items before enqueuing.",
    problem:
      "Cafeteria POS systems fail under peak load — multiple users race to order the last item simultaneously. Synchronous flows either over-block throughput or allow overselling. We needed guaranteed inventory consistency without sacrificing API response time.",
    challenges: [
      "Race conditions on low-stock items solved with Redis SET NX atomic locks before any enqueue operation",
      "Worker crashes mid-job required idempotency keys on all order mutations to prevent duplicate fulfillment",
      "Cache invalidation for menu updates — chose pub/sub over TTL-only for near-instant propagation",
    ],
    decisions: [
      "BullMQ over raw Redis — built-in retry logic, job prioritization, and ops dashboard out of the box",
      "Redis 80s TTL on menu data eliminated 94% of redundant DB reads at peak lunch windows",
      "Prisma over raw SQL — version-controlled migrations, far less deployment friction",
      "Stateless JWT + Glauth — auth service scales horizontally with zero session store overhead",
    ],
    features: [
      { title: "Live inventory sync", desc: "Stock levels update in real-time across all clients via WebSocket on every order commit" },
      { title: "Atomic order locking", desc: "Redis SET NX prevents two users from claiming the last item — lock released if queue job fails" },
      { title: "Queue-based processing", desc: "BullMQ decouples intake from fulfillment — API stays sub-120ms even when workers are backlogged" },
      { title: "Smart cache layer", desc: "Redis 80s TTL with pub/sub invalidation eliminates 94% of Postgres reads at peak" },
    ],
    stack: ["Next.js", "Node.js", "Express", "PostgreSQL", "Redis", "BullMQ", "Prisma", "Docker", "Nginx"],
    metrics: [
      { value: "<120ms", label: "API Response", highlight: true },
      { value: "2,400+", label: "Orders / Day", highlight: false },
      { value: "94%", label: "Cache Hit Rate", highlight: false },
      { value: "99.9%", label: "Uptime", highlight: false },
    ],
    githubUrl: "https://github.com",
    demoUrl: "https://example.com",
    diagramType: "sunakku",
  },
  {
    id: "velox",
    num: "02",
    name: "Velox",
    category: "WebApp",
    href: "/projects/velox",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/velox.png`,
    status: "Production",
    year: "2025",
    role: "Solo Architecture & Engineering",
    type: "Backend System",
    impact: "Eliminated single points of failure across all notification channels at production scale.",
    duration: "3 months",
    sub: "notification dispatch engine — event-driven, multi-channel, 500k msg/day",
    tags: [
      { label: "Production", type: "live" },
      { label: "Kafka / Events", type: "type" },
      { label: "Go Workers", type: "type" },
    ],
    overview:
      "Velox completely decouples notification triggering from delivery. Any upstream service drops a Kafka event without knowing which channels are downstream. A central router fans out to isolated Go workers — one per channel. Each worker owns its retry logic, rate limiting, and provider failover independently, so a Twilio outage never touches SendGrid throughput.",
    problem:
      "Monolithic notification pipelines become single points of failure. One slow SMS provider stalls email delivery for unrelated users. Notification logic bleeds into business services and a single security patch requires 6 coordinated deploys across the stack.",
    challenges: [
      "Provider failover — circuit breaker trips after 3 consecutive 5xx responses, rerouting to backup provider",
      "Exactly-once delivery using idempotency tokens in Redis with 24h TTL to safely deduplicate Kafka replays",
      "Per-user per-channel rate limiting without blocking sibling users in the same Kafka partition",
    ],
    decisions: [
      "Kafka over RabbitMQ — log retention enables full replay of missed notifications during any channel outage",
      "Go workers per channel — goroutines handle the concurrency profile far cheaper than Node.js thread pools",
      "Dead letter queue after 3 retries — no silent failures, everything is inspectable and replayable",
      "Redis preference store — O(1) channel lookup before every dispatch, no DB touch at 500k msg/day",
    ],
    features: [
      { title: "Channel isolation", desc: "Each delivery channel runs in its own Go worker — Twilio outage never affects SendGrid or FCM" },
      { title: "Event replay", desc: "Kafka log retention enables full replay of missed notifications during outages with zero data loss" },
      { title: "Circuit breaker", desc: "Automatic provider failover after 3 consecutive failures — switches to backup within milliseconds" },
      { title: "Preference routing", desc: "Per-user channel preferences stored in Redis for O(1) lookup — no DB touch per dispatch at scale" },
    ],
    stack: ["Node.js", "Kafka", "Go", "MongoDB", "Redis", "SendGrid", "Twilio", "FCM", "Kubernetes"],
    metrics: [
      { value: "500k+", label: "Msgs / Day", highlight: true },
      { value: "99.97%", label: "Delivery Rate", highlight: false },
      { value: "<800ms", label: "P99 Latency", highlight: false },
      { value: "3", label: "Channels", highlight: false },
    ],
    githubUrl: "https://github.com",
    demoUrl: "",
    diagramType: "velox",
  },
  {
    id: "gatekeeper",
    num: "03",
    name: "Gatekeeper",
    category: "AI",
    href: "/projects/gatekeeper",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/gatekeeper.jpeg`,
    status: "Production",
    year: "2025",
    role: "Solo Architecture & Engineering",
    type: "Backend System",
    impact: "Eliminated single points of failure across all notification channels at production scale.",
    duration: "3 months",
    sub: "multi-tenant auth gateway — OAuth2, RBAC, centralized identity plane",
    tags: [
      { label: "Deployed", type: "live" },
      { label: "Go + gRPC", type: "type" },
      { label: "Zero-Trust", type: "type" },
    ],
    overview:
      "A unified identity plane in front of all internal microservices. Instead of each service implementing its own auth, they delegate token verification to Gatekeeper via a lightweight gRPC sidecar. Security policy, RBAC rules, and audit logs all live in one place — enforcing zero-trust defaults with under 2ms overhead per request.",
    problem:
      "Auth scattered across 8 services meant every security patch needed 8 coordinated deploys. A permission bug in one service could expose another tenant's data. Each service reinvented token validation slightly differently — impossible to audit uniformly across the platform.",
    challenges: [
      "Token revocation propagation — pub/sub invalidation pushes to all Redis nodes within 200ms of a revoke call",
      "Multi-tenant isolation via row-level security in Postgres so no policy evaluation crosses tenant boundaries",
      "Graceful degradation — sidecars cache last valid token locally so a Gatekeeper restart cannot cascade",
    ],
    decisions: [
      "Casbin RBAC — policy-as-code with hot reload, zero restarts needed when permission rules change",
      "gRPC sidecar over REST — binary protocol + persistent connections removed ~1.5ms per auth overhead",
      "Redis token cache with 60s sliding TTL — eliminates DB pressure at 12k req/min sustained load",
      "Append-only Postgres audit log with row checksums — tamper-evident, passes SOC2 requirements",
    ],
    features: [
      { title: "Centralized RBAC", desc: "Casbin policy-as-code with hot reload — update permissions across all 8 services instantly, zero restarts" },
      { title: "gRPC sidecar auth", desc: "Lightweight sidecar keeps auth overhead under 2ms — services never implement validation themselves" },
      { title: "Token cache layer", desc: "Redis 60s sliding TTL absorbs 12k req/min without touching Postgres on every request" },
      { title: "Tamper-evident audit", desc: "Append-only Postgres table with row-level checksums — every auth decision logged and verifiable" },
    ],
    stack: ["Go", "gRPC", "PostgreSQL", "Redis", "JWT", "OAuth2", "Casbin", "Envoy", "Prometheus"],
    metrics: [
      { value: "<2ms", label: "Auth Overhead", highlight: true },
      { value: "8", label: "Services", highlight: false },
      { value: "12k", label: "Req / Min", highlight: false },
      { value: "100%", label: "Audit Coverage", highlight: false },
    ],
    githubUrl: "https://github.com",
    demoUrl: "",
    diagramType: "gatekeeper",
  },
];