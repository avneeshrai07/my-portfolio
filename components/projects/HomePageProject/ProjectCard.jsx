import { useState, useRef, useEffect, useCallback } from "react";
import { projects as PROJECTS } from "@/types/projects"; // adjust path to your projects.ts

/* ─── STYLES ─────────────────────────────────────────────────────── */
const S = {
  root: {
    display: "flex",
    height: "92vh",
    minHeight: 600,
    maxHeight: 900,
    background: "#f5f0eb",
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #e8e0d5",
    boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
  },
  sidebar: {
    width: 260,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #e8e0d5",
    background: "#fff",
    overflow: "hidden",
  },
  sidebarHeader: {
    padding: "22px 20px 14px",
    borderBottom: "1px solid #f0ebe3",
    flexShrink: 0,
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#a09488",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  sidebarCount: { fontSize: 11, color: "#bbb0a4" },
  navList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    scrollbarWidth: "none",
  },
  detail: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
    background: "#fff",
  },
  detailScroll: { flex: 1, overflowY: "auto", scrollbarWidth: "none" },
  hero: { position: "relative", height: 260, flexShrink: 0, overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.72) 100%)",
  },
  heroMeta: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 28px" },
  heroTitle: {
    fontSize: 38,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.03em",
    lineHeight: 1,
    fontFamily: "'DM Serif Display', Georgia, serif",
  },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.4 },
  numBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    background: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    borderRadius: 99,
    padding: "3px 10px",
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: 500,
    border: "0.5px solid rgba(255,255,255,0.15)",
  },
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 10,
    fontWeight: 600,
    color: "rgba(255,255,255,0.85)",
    background: "rgba(255,255,255,0.12)",
    border: "0.5px solid rgba(255,255,255,0.2)",
    borderRadius: 99,
    padding: "3px 10px",
    marginBottom: 10,
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
  },
  yearBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 10,
    fontWeight: 500,
    color: "rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.08)",
    border: "0.5px solid rgba(255,255,255,0.15)",
    borderRadius: 99,
    padding: "3px 10px",
    marginBottom: 10,
  },
  body: { padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#b0a494",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 12,
  },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 },
  featureCard: {
    background: "#faf7f3",
    border: "1px solid #f0ebe3",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    cursor: "default",
    transition: "border-color 0.15s, transform 0.2s",
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "#fff",
    border: "1px solid #e8e0d5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  },
  featureName: { fontSize: 12, fontWeight: 600, color: "#1a0d06", lineHeight: 1.3 },
  featureDesc: { fontSize: 11, color: "#9a8c7e", marginTop: 2, lineHeight: 1.4 },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 },
  metricCard: {
    background: "#faf7f3",
    border: "1px solid #f0ebe3",
    borderRadius: 10,
    padding: "12px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  metricCardHighlight: {
    background: "#1a0d06",
    border: "1px solid #1a0d06",
    borderRadius: 10,
    padding: "12px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  metricVal: { fontSize: 15, fontWeight: 700, color: "#1a0d06", lineHeight: 1.2, textAlign: "center" },
  metricValLight: { fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2, textAlign: "center" },
  metricLbl: { fontSize: 10, color: "#b0a494" },
  metricLblLight: { fontSize: 10, color: "rgba(255,255,255,0.6)" },
  metaStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    background: "#faf7f3",
    border: "1px solid #f0ebe3",
    borderRadius: 12,
    overflow: "hidden",
  },
  metaCell: {
    padding: "14px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  metaVal: { fontSize: 12, fontWeight: 600, color: "#1a0d06", lineHeight: 1.2, textAlign: "center" },
  metaLbl: { fontSize: 10, color: "#b0a494" },
  stackRow: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" },
  stackChip: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "5px 12px 5px 6px",
    borderRadius: 99,
    background: "#faf7f3",
    border: "1px solid #e8e0d5",
    cursor: "default",
    transition: "border-color 0.15s, transform 0.2s",
  },
  stackDot: {
    width: 20,
    height: 20,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
    color: "#fff",
  },
  stackName: { fontSize: 12, fontWeight: 500, color: "#1a0d06" },
  actions: { display: "flex", gap: 10 },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 22px",
    borderRadius: 10,
    background: "#1a0d06",
    color: "#fff",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "none",
    transition: "opacity 0.15s, transform 0.15s",
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 22px",
    borderRadius: 10,
    background: "#fff",
    color: "#1a0d06",
    border: "1px solid #ddd5c8",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "none",
    transition: "background 0.15s, transform 0.15s",
  },
  quote: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 18px",
    background: "#faf7f3",
    borderRadius: 12,
    borderLeft: "2px solid #ddd5c8",
  },
  quoteText: { fontSize: 13, color: "#9a8c7e", fontStyle: "italic", lineHeight: 1.5 },
  overviewText: { fontSize: 13, color: "#6b5e54", lineHeight: 1.7, margin: 0 },
};

/* ─── NAV META ─────────────────────────────────────────────────────── */
// Icon + background per project id — extend as you add projects to projects.ts
const NAV_META = {
  sunakku:    { navIcon: "🛒", iconBg: "#fef0e6" },
  velox:      { navIcon: "📡", iconBg: "#e8f0fe" },
  gatekeeper: { navIcon: "🔐", iconBg: "#f0faf4" },
};

function getNavMeta(id) {
  return NAV_META[id] ?? { navIcon: "💻", iconBg: "#f5f0eb" };
}

/* ─── STACK COLOUR MAP ─────────────────────────────────────────────── */
// Extend as needed to match your projects.ts stack arrays
const STACK_COLORS = {
  "Next.js": "#000",    "Node.js": "#3c873a",  "Express": "#444",
  "PostgreSQL": "#336791", "Redis": "#dc382c",  "BullMQ": "#c57a1e",
  "Docker": "#2496ed",  "Nginx": "#009639",    "Prisma": "#0c344b",
  "Kafka": "#231f20",   "Go": "#00acd7",       "MongoDB": "#4db33d",
  "Kubernetes": "#326ce5", "SendGrid": "#1a82e2","Twilio": "#f22f46",
  "FCM": "#fcca03",     "gRPC": "#244c5a",     "JWT": "#a020f0",
  "OAuth2": "#e8711a",  "Casbin": "#1a6e3a",   "Envoy": "#ac6199",
  "Prometheus": "#e6522c", "React": "#61dafb",  "Python": "#306998",
  "FastAPI": "#009688", "Plaid": "#00a3ff",    "Celery": "#78a831",
  "OpenAI": "#10a37f",  "Tailwind": "#38bdf8", "AWS S3": "#ff9900",
  "Socket.io": "#010101",
};

/* ─── NAV ITEM ─────────────────────────────────────────────────────── */
function NavItem({ project, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isLive = project.status === "Production";
  const { navIcon, iconBg } = getNavMeta(project.id);

  return (
    <button
      data-id={project.id}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "9px 11px",
        borderRadius: 11,
        cursor: "pointer",
        border: active ? "1px solid #e0d6cb" : "1px solid transparent",
        background: active || hovered ? "#faf7f3" : "transparent",
        width: "100%",
        textAlign: "left",
        transition: "all 0.15s ease",
        fontFamily: "inherit",
      }}
      aria-pressed={active}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          flexShrink: 0,
          background: iconBg,
          transition: "transform 0.2s",
          transform: hovered || active ? "scale(1.08)" : "scale(1)",
        }}
      >
        {navIcon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0d06", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>
          {project.name}
        </div>
        <div style={{ fontSize: 11, color: "#b0a494", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>
          {project.sub}
        </div>
        {isLive ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, color: "#15803d", background: "#dcfce7", borderRadius: 99, padding: "2px 7px", marginTop: 3 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pf-pulse 2s ease-in-out infinite" }} />
            Live
          </div>
        ) : (
          <div style={{ fontSize: 10, color: "#c0b4a8", marginTop: 3 }}>{project.year}</div>
        )}
      </div>

      {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4651a", flexShrink: 0 }} />}
    </button>
  );
}

/* ─── FEATURE CARD ─────────────────────────────────────────────────── */
const FEAT_ICONS = ["⚡", "🔀", "🔑", "📊", "🛡️", "🔁", "💾", "📋"];

function FeatureCard({ feature, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...S.featureCard, borderColor: hovered ? "#c8bfb0" : "#f0ebe3", transform: hovered ? "translateY(-2px)" : "translateY(0)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.featureIcon}>{FEAT_ICONS[index % FEAT_ICONS.length]}</div>
      <div>
        <div style={S.featureName}>{feature.title}</div>
        <div style={S.featureDesc}>{feature.desc}</div>
      </div>
    </div>
  );
}

/* ─── STACK CHIP ───────────────────────────────────────────────────── */
function StackChip({ name }) {
  const [hovered, setHovered] = useState(false);
  const color = STACK_COLORS[name] ?? "#888";
  return (
    <div
      style={{ ...S.stackChip, borderColor: hovered ? "#c8bfb0" : "#e8e0d5", transform: hovered ? "translateY(-2px)" : "translateY(0)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...S.stackDot, background: color }}>{name[0]}</div>
      <span style={S.stackName}>{name}</span>
    </div>
  );
}

/* ─── DETAIL PANEL ─────────────────────────────────────────────────── */
function DetailPanel({ project, idx, total, visible }) {
  const isLive = project.status === "Production";

  const metaCells = [
    { icon: "📅", val: project.duration, label: "Duration" },
    { icon: "🚀", val: project.status,   label: "Status"   },
    { icon: "👤", val: "Solo",            label: "Team"     },
    { icon: "✨", val: project.year,      label: "Year"     },
  ];

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>

      {/* Hero */}
      <div style={S.hero}>
        <img src={project.image} alt={project.name} style={S.heroImg} />
        <div style={S.heroOverlay} />
        <div style={S.heroMeta}>
          {isLive ? (
            <div style={S.liveBadge}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pf-pulse 2s ease-in-out infinite" }} />
              Live project
            </div>
          ) : (
            <div style={S.yearBadge}>📅 {project.year}</div>
          )}
          <div style={S.heroTitle}>{project.name}</div>
          <div style={S.heroSub}>{project.sub}</div>
        </div>
        <div style={S.numBadge}>{idx + 1} / {total}</div>
      </div>

      {/* Body */}
      <div style={S.body}>

        {/* Overview */}
        <div>
          <div style={S.sectionLabel}>Overview</div>
          <p style={S.overviewText}>{project.overview}</p>
        </div>

        {/* Features */}
        {project.features?.length > 0 && (
          <div>
            <div style={S.sectionLabel}>Key features</div>
            <div style={S.featuresGrid}>
              {project.features.map((f, i) => (
                <FeatureCard key={f.title} feature={f} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        {project.metrics?.length > 0 && (
          <div>
            <div style={S.sectionLabel}>Performance</div>
            <div style={S.metricsGrid}>
              {project.metrics.map((m) => (
                <div key={m.label} style={m.highlight ? S.metricCardHighlight : S.metricCard}>
                  <div style={m.highlight ? S.metricValLight : S.metricVal}>{m.value}</div>
                  <div style={m.highlight ? S.metricLblLight : S.metricLbl}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stack */}
        {project.stack?.length > 0 && (
          <div>
            <div style={S.sectionLabel}>Built with</div>
            <div style={S.stackRow}>
              {project.stack.map((name) => <StackChip key={name} name={name} />)}
            </div>
          </div>
        )}

        {/* Project details */}
        <div>
          <div style={S.sectionLabel}>Project details</div>
          <div style={S.metaStrip}>
            {metaCells.map((m, i) => (
              <div key={m.label} style={{ ...S.metaCell, borderRight: i < metaCells.length - 1 ? "1px solid #f0ebe3" : "none" }}>
                <span style={{ fontSize: 16 }}>{m.icon}</span>
                <div style={S.metaVal}>{m.val}</div>
                <div style={S.metaLbl}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={S.actions}>
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={S.btnPrimary}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              ▶ View project
            </a>
          ) : (
            <button style={{ ...S.btnPrimary, opacity: 0.5, cursor: "not-allowed" }} disabled>
              ▶ View project
            </button>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={S.btnSecondary}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#faf7f3"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {"</>"} View code
            </a>
          )}
        </div>

        {/* Impact quote */}
        <div style={S.quote}>
          <span style={{ fontSize: 26, color: "#d8cfc4", lineHeight: 1, fontFamily: "Georgia, serif", userSelect: "none", flexShrink: 0 }}>"</span>
          <span style={S.quoteText}>{project.impact}</span>
          <span style={{ fontSize: 26, color: "#d8cfc4", lineHeight: 1, fontFamily: "Georgia, serif", userSelect: "none", flexShrink: 0 }}>"</span>
        </div>

      </div>
    </div>
  );
}

/* ─── ROOT COMPONENT ───────────────────────────────────────────────── */
export default function PortfolioShowcase() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const [visible,  setVisible]  = useState(true);

  const detailScrollRef  = useRef(null);
  const navListRef       = useRef(null);

  // Lock prevents re-entrant / competing transitions — the root cause of the blink
  const lockedRef        = useRef(false);
  // Keep prev scroll position outside the handler so it's never stale
  const lastScrollTopRef = useRef(0);

  const activeIndex   = PROJECTS.findIndex((p) => p.id === activeId);
  const activeProject = PROJECTS[activeIndex];

  /* ── project switcher ─────────────────────────────────────────── */
  const selectProject = useCallback((id, fromScroll = false) => {
    if (id === activeId || lockedRef.current) return;

    lockedRef.current = true;          // acquire lock immediately

    setVisible(false);
    setTimeout(() => {
      setActiveId(id);
      setVisible(true);

      if (!fromScroll) {
        detailScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        const btn = navListRef.current?.querySelector(`[data-id="${id}"]`);
        btn?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }

      // Release lock only after scroll position has fully settled
      setTimeout(() => {
        lastScrollTopRef.current = detailScrollRef.current?.scrollTop ?? 0;
        lockedRef.current = false;
      }, 400);
    }, 180);
  }, [activeId]);

  /* ── keyboard navigation ──────────────────────────────────────── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const idx = PROJECTS.findIndex((p) => p.id === activeId);
      if (e.key === "ArrowDown" && idx < PROJECTS.length - 1) selectProject(PROJECTS[idx + 1].id);
      if (e.key === "ArrowUp"   && idx > 0)                   selectProject(PROJECTS[idx - 1].id);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeId, selectProject]);

  /* ── scroll-driven navigation ─────────────────────────────────── */
  useEffect(() => {
    const el = detailScrollRef.current;
    if (!el) return;

    // Reset baseline each time the active project changes
    lastScrollTopRef.current = 0;

    const onScroll = () => {
      // Hard bail if a transition is already in-flight
      if (lockedRef.current) return;

      const st        = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const prev      = lastScrollTopRef.current;

      // Ignore tiny momentum/rubber-band ticks
      if (Math.abs(st - prev) < 2) return;

      const scrollingDown = st > prev;
      lastScrollTopRef.current = st;

      const idx = PROJECTS.findIndex((p) => p.id === activeId);

      if (scrollingDown && st >= maxScroll - 4 && idx < PROJECTS.length - 1) {
        selectProject(PROJECTS[idx + 1].id, true);
        // Snap scroll back to top synchronously so the next project starts fresh
        requestAnimationFrame(() => { el.scrollTop = 0; });
      } else if (!scrollingDown && st <= 4 && idx > 0) {
        selectProject(PROJECTS[idx - 1].id, true);
        requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeId, selectProject]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        @keyframes pf-pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
        *::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={S.root}>

        {/* ── Sidebar ── */}
        <aside style={S.sidebar}>
          <div style={S.sidebarHeader}>
            <div style={S.sidebarTitle}>Projects</div>
            <div style={S.sidebarCount}>{PROJECTS.length} projects · ↑↓ to navigate</div>
          </div>
          <div style={S.navList} ref={navListRef}>
            {PROJECTS.map((p) => (
              <NavItem
                key={p.id}
                project={p}
                active={p.id === activeId}
                onClick={() => selectProject(p.id)}
              />
            ))}
          </div>
        </aside>

        {/* ── Detail panel ── */}
        <div style={S.detail}>
          <div style={S.detailScroll} ref={detailScrollRef}>
            <DetailPanel
              project={activeProject}
              idx={activeIndex}
              total={PROJECTS.length}
              visible={visible}
            />
          </div>
        </div>

      </div>
    </>
  );
}