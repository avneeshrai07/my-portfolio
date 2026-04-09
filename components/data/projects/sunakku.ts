import type { ProjectConfig } from "@/types/project";

export const sunakku: ProjectConfig = {
  id: "sunakku",
  title: "Sunakku — Snack Ordering Platform",
  description:
    "A real-time snack ordering system with live inventory, caching, and queue-based order processing built for high-throughput cafeteria environments.",
  badge: "Case Study",
  status: "live",

  techStack: [
    "Next.js", "Node.js", "PostgreSQL", "Redis",
    "BullMQ", "Prisma", "Docker", "Nginx",
  ],

  flow: {
    nodes: [
      { id: "client",  type: "client",  label: "Web App",        sublabel: "Next.js",     position: "top"          },
      { id: "api",     type: "api",     label: "REST API",       sublabel: "Express",     position: "center"       },
      { id: "auth",    type: "auth",    label: "Auth Service",   sublabel: "JWT / OAuth", position: "left"         },
      { id: "cache",   type: "cache",   label: "Redis Cache",    sublabel: "TTL 60s",     position: "right"        },
      { id: "queue",   type: "queue",   label: "Order Queue",    sublabel: "BullMQ",      position: "bottom-left"  },
      { id: "db",      type: "db",      label: "PostgreSQL",     sublabel: "Prisma ORM",  position: "bottom-right" },
    ],
    edges: [
      ["client", "api"],
      ["api", "auth"],
      ["api", "cache"],
      { source: "api",   target: "queue", label: "enqueue" },
      { source: "queue", target: "db",    label: "persist",  animated: true },
      { source: "api",   target: "db",    label: "read",     animated: false },
    ],
  },

  metrics: [
    { label: "Response Time", value: "<120ms", icon: "⚡" },
    { label: "Orders / Day",  value: "2,400+", icon: "📦" },
    { label: "Cache Hit",     value: "94%",    icon: "🎯" },
    { label: "Uptime",        value: "99.9%",  icon: "🟢" },
  ],

  challenges: [
    {
      problem: "Inventory reads caused N+1 queries under cafeteria rush hour load.",
      solution:
        "Implemented a Redis cache layer with a 60s TTL; hot-path reads never hit the DB.",
      result: "Latency dropped from 800ms to under 120ms at peak.",
    },
    {
      problem: "Order bursts caused dropped writes when DB was under load.",
      solution:
        "Moved order persistence to a BullMQ queue with retry and back-off policies.",
      result: "Zero dropped orders; retry success rate 99.7%.",
    },
  ],

  cta: [
    { label: "Live Demo",   href: "https://sunakku.example.com",             variant: "primary"   },
    { label: "GitHub",      href: "https://github.com/you/sunakku",          variant: "secondary" },
    { label: "Case Study",  href: "https://your-blog.com/sunakku-deep-dive", variant: "ghost"     },
  ],
};