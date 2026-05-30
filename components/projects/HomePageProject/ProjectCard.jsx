"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { projects as PROJECTS } from "@/types/projects";
import StackIcon from "tech-stack-icons";
import { techStack } from "@/types/techStack";

/* ─── TECH LOOKUP ─────────────────────────────────────────────────────── */
const TECH_BY_NAME = Object.fromEntries(
  techStack.map((t) => [t.name.toLowerCase(), t])
);
const TECH_ALIASES = {
  "next.js":    "next.js",
  "node.js":    "node.js",
  "aws s3":     "aws",
  "socket.io":  "socket.io",
  "postgresql": "postgresql",
  "go":         "go",
};
function resolveTech(stackName) {
  const key = TECH_ALIASES[stackName.toLowerCase()] ?? stackName.toLowerCase();
  return TECH_BY_NAME[key] ?? {
    name: stackName,
    iconName: stackName.toLowerCase().replace(/[^a-z0-9]/g, ""),
    bubbleColor: "#888",
  };
}

/* ─── DESIGN TOKENS (earthy palette aligned with site) ────────────────── */
const T = {
  cream:      "#F8F2E8",
  parchment:  "#FAF5EC",
  sand:       "#EDE0CC",
  border:     "#DDD0B8",
  borderHard: "#C8A870",
  terra:      "#C4694A",
  terraLight: "#E8A080",
  brown:      "#513720",
  brownMid:   "#7A4A28",
  brownLight: "#9A6A48",
  muted:      "#B0926E",
  ink:        "#2A1608",
  detail:     "#5A3E28",
  white:      "#FDFAF6",
  liveBg:     "#E8F0DC",
  liveTx:     "#3A6820",
  liveDot:    "#5A9A30",
};

/* ─── STYLES ─────────────────────────────────────────────────────────── */
const S = {
  root: {
    display: "flex",
    height: "88vh",
    minHeight: 580,
    maxHeight: 860,
    background: T.cream,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    borderRadius: 18,
    overflow: "hidden",
    border: `1px solid ${T.border}`,
    boxShadow: "0 8px 48px rgba(81,55,32,0.12), 0 2px 8px rgba(81,55,32,0.06)",
  },

  /* ── Sidebar ── */
  sidebar: {
    width: 252,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    borderRight: `1px solid ${T.border}`,
    background: T.parchment,
    overflow: "hidden",
  },
  sidebarHeader: {
    padding: "20px 18px 14px",
    borderBottom: `1px solid ${T.border}`,
    flexShrink: 0,
  },
  sidebarLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: T.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: "'Cinzel', Georgia, serif",
  },
  sidebarCount: {
    fontSize: 11,
    color: T.brownLight,
    opacity: 0.7,
  },
  navList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    scrollbarWidth: "none",
  },

  /* ── Detail area ── */
  detail: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
    background: T.white,
    position: "relative",
  },
  detailScroll: { flex: 1, overflowY: "auto", scrollbarWidth: "none" },

  /* ── Hero ── */
  hero: { position: "relative", height: 280, flexShrink: 0, overflow: "hidden" },
  heroImgWrap: { position: "absolute", inset: 0 },
  heroImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(160deg, rgba(0,0,0,0.08) 0%, rgba(20,8,2,0.55) 55%, rgba(20,8,2,0.82) 100%)",
  },
  heroMeta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "24px 28px 22px",
  },
  heroCategory: {
    display: "inline-block",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.65)",
    marginBottom: 8,
    fontFamily: "'Cinzel', Georgia, serif",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 400,
    color: "#fff",
    letterSpacing: "-0.02em",
    lineHeight: 1.05,
    fontFamily: "'DM Serif Display', Georgia, serif",
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 1.5,
    maxWidth: 400,
  },

  /* Badges */
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 10,
    fontWeight: 600,
    color: T.liveTx,
    background: "rgba(232,240,220,0.85)",
    borderRadius: 99,
    padding: "3px 10px",
    marginBottom: 10,
    backdropFilter: "blur(4px)",
  },
  yearBadge: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 10,
    fontWeight: 500,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 8,
    letterSpacing: "0.04em",
  },
  numBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderRadius: 99,
    padding: "4px 12px",
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: 500,
    border: "0.5px solid rgba(255,255,255,0.12)",
    letterSpacing: "0.06em",
    fontFamily: "'Cinzel', Georgia, serif",
  },

  /* ── Body content ── */
  body: { padding: "22px 28px", display: "flex", flexDirection: "column", gap: 22 },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: T.muted,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    marginBottom: 12,
    fontFamily: "'Cinzel', Georgia, serif",
  },
  overviewText: {
    fontSize: 13,
    color: T.detail,
    lineHeight: 1.75,
    margin: 0,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 15,
  },

  /* ── Features ── */
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 },
  featureCard: {
    background: T.cream,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "13px 15px",
    display: "flex",
    alignItems: "flex-start",
    gap: 11,
    transition: "border-color 0.2s, transform 0.22s cubic-bezier(0.25,1,0.5,1), box-shadow 0.2s",
    cursor: "default",
  },
  featureNum: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: T.terra,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: "'Cinzel', Georgia, serif",
    letterSpacing: "0.02em",
  },
  featureName: { fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.3 },
  featureDesc: { fontSize: 11, color: T.brownLight, marginTop: 2, lineHeight: 1.45 },

  /* ── Metrics ── */
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 },
  metricCard: {
    background: T.cream,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "12px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    transition: "transform 0.2s cubic-bezier(0.25,1,0.5,1)",
  },
  metricCardHighlight: {
    background: T.terra,
    border: `1px solid ${T.terra}`,
    borderRadius: 10,
    padding: "12px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    transition: "transform 0.2s cubic-bezier(0.25,1,0.5,1)",
    boxShadow: `0 4px 14px rgba(196,105,74,0.3)`,
  },
  metricVal:      { fontSize: 15, fontWeight: 700, color: T.ink,  lineHeight: 1.2, textAlign: "center" },
  metricValLight: { fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2, textAlign: "center" },
  metricLbl:      { fontSize: 10, color: T.muted, textAlign: "center" },
  metricLblLight: { fontSize: 10, color: "rgba(255,255,255,0.72)", textAlign: "center" },

  /* ── Meta strip ── */
  metaStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    background: T.cream,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    overflow: "hidden",
  },
  metaCell: {
    padding: "13px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  metaIcon: { fontSize: 13, color: T.terra, lineHeight: 1 },
  metaVal:  { fontSize: 11, fontWeight: 600, color: T.ink, lineHeight: 1.2, textAlign: "center" },
  metaLbl:  { fontSize: 9,  color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Cinzel', Georgia, serif" },

  /* ── Stack pills ── */
  stackRow: { display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" },
  stackPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 11px 5px 7px",
    borderRadius: 99,
    background: T.cream,
    border: `1px solid ${T.border}`,
    transition: "border-color 0.18s, transform 0.18s cubic-bezier(0.25,1,0.5,1), background 0.18s",
  },
  stackPillName: { fontSize: 12, fontWeight: 500, color: T.brown },

  /* ── Actions ── */
  actions: { display: "flex", gap: 8 },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 22px",
    borderRadius: 10,
    background: T.brown,
    color: "#fff",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "none",
    transition: "opacity 0.2s, transform 0.2s cubic-bezier(0.25,1,0.5,1)",
    letterSpacing: "0.01em",
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 22px",
    borderRadius: 10,
    background: "transparent",
    color: T.brown,
    border: `1px solid ${T.border}`,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "none",
    transition: "background 0.18s, border-color 0.18s, transform 0.2s cubic-bezier(0.25,1,0.5,1)",
  },

  /* ── Quote ── */
  quote: {
    padding: "18px 20px",
    background: T.cream,
    borderRadius: 12,
    border: `1px solid ${T.border}`,
    borderLeft: `3px solid ${T.terra}`,
  },
  quoteText: {
    fontSize: 14,
    color: T.detail,
    fontStyle: "italic",
    lineHeight: 1.65,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 16,
  },
  quoteAttr: {
    fontSize: 10,
    color: T.muted,
    marginTop: 8,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: "'Cinzel', Georgia, serif",
  },
};

/* ─── SVG ICONS ──────────────────────────────────────────────────────── */
function IconPlay({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
      <path d="M2.5 1.5L10 6L2.5 10.5V1.5Z" />
    </svg>
  );
}
function IconGitHub({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
function IconClock({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  );
}
function IconRocket({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
function IconUser({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconCalendar({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

/* ─── NAV ITEM ───────────────────────────────────────────────────────── */
function NavItem({ project, index, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isLive = project.status === "Production";
  const num = String(index + 1).padStart(2, "0");

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
        padding: "10px 12px",
        borderRadius: 11,
        cursor: "pointer",
        border: `1px solid ${active ? T.borderHard : "transparent"}`,
        background: active ? T.sand : hovered ? "rgba(81,55,32,0.04)" : "transparent",
        width: "100%",
        textAlign: "left",
        transition: "background 0.2s, border-color 0.2s",
        fontFamily: "inherit",
        position: "relative",
      }}
      aria-pressed={active}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute",
        left: 0,
        top: "20%",
        bottom: "20%",
        width: 3,
        borderRadius: 99,
        background: active ? T.terra : "transparent",
        transition: "background 0.2s",
      }} />

      {/* Number badge */}
      <div style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: active ? T.terra : T.cream,
        border: `1px solid ${active ? T.terra : T.border}`,
        transition: "background 0.2s, border-color 0.2s, transform 0.25s cubic-bezier(0.16,1,0.3,1)",
        transform: (hovered || active) ? "scale(1.06)" : "scale(1)",
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: active ? "#fff" : T.brownMid,
          fontFamily: "'Cinzel', Georgia, serif",
          letterSpacing: "0.04em",
        }}>{num}</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: active ? T.ink : T.brown,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.3,
        }}>
          {project.name}
        </div>
        <div style={{
          fontSize: 11,
          color: T.brownLight,
          opacity: 0.8,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginTop: 2,
          lineHeight: 1.3,
        }}>
          {project.category}
        </div>
        {isLive && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 9,
            fontWeight: 700,
            color: T.liveTx,
            background: T.liveBg,
            borderRadius: 99,
            padding: "2px 7px",
            marginTop: 4,
            fontFamily: "'Cinzel', Georgia, serif",
            letterSpacing: "0.06em",
          }}>
            <span style={{
              width: 5, height: 5,
              borderRadius: "50%",
              background: T.liveDot,
              display: "inline-block",
              animation: "pf-pulse 2s ease-in-out infinite",
            }} />
            Live
          </div>
        )}
      </div>
    </button>
  );
}

/* ─── FEATURE CARD ───────────────────────────────────────────────────── */
function FeatureCard({ feature, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...S.featureCard,
        borderColor: hovered ? T.borderHard : T.border,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 4px 16px rgba(81,55,32,0.08)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.featureNum}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div>
        <div style={S.featureName}>{feature.title}</div>
        <div style={S.featureDesc}>{feature.desc}</div>
      </div>
    </div>
  );
}

/* ─── STACK PILL ─────────────────────────────────────────────────────── */
function StackPill({ stackName }) {
  const [hovered, setHovered] = useState(false);
  const tech = resolveTech(stackName);
  return (
    <div
      style={{
        ...S.stackPill,
        borderColor: hovered ? T.borderHard : T.border,
        background: hovered ? T.sand : T.cream,
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StackIcon name={tech.iconName} style={{ width: 16, height: 16, flexShrink: 0 }} />
      <span style={S.stackPillName}>{tech.name}</span>
    </div>
  );
}

/* ─── STAGGERED BODY ─────────────────────────────────────────────────── */
function StaggerBody({ children, animKey }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const id = requestAnimationFrame(() => ref.current?.classList.add("pf-stagger-go"));
    return () => cancelAnimationFrame(id);
  }, [animKey]);

  return (
    <div ref={ref} className="pf-stagger" style={S.body}>
      {children}
    </div>
  );
}

/* ─── DETAIL PANEL ───────────────────────────────────────────────────── */
function DetailPanel({ project, idx, total, animState }) {
  const isLive = project.status === "Production";
  const panelClass =
    animState === "entering" ? "pf-panel-enter"
    : animState === "exiting" ? "pf-panel-exit"
    : "";

  const metaCells = [
    { Icon: IconClock,    val: project.duration, label: "Duration" },
    { Icon: IconRocket,   val: project.status,   label: "Status"   },
    { Icon: IconUser,     val: "Solo",            label: "Team"     },
    { Icon: IconCalendar, val: project.year,      label: "Year"     },
  ];

  return (
    <div
      className={panelClass}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        pointerEvents: animState === "exiting" ? "none" : "auto",
        zIndex: animState === "exiting" ? 2 : 1,
      }}
    >
      {/* ── Hero ── */}
      <div style={S.hero}>
        <div style={S.heroImgWrap} className={animState === "entering" ? "pf-hero-enter" : ""}>
          <img src={project.image} alt={project.name} style={S.heroImg} />
        </div>
        <div style={S.heroOverlay} />
        <div style={S.heroMeta}>
          {isLive ? (
            <div style={S.liveBadge}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: T.liveDot, display: "inline-block",
                animation: "pf-pulse 2s ease-in-out infinite",
              }} />
              Live
            </div>
          ) : (
            <div style={S.yearBadge}>{project.year}</div>
          )}
          <div style={S.heroCategory}>{project.category}</div>
          <div style={S.heroTitle}>{project.name}</div>
          <div style={S.heroSub}>{project.sub}</div>
        </div>
        <div style={S.numBadge}>{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
      </div>

      {/* ── Body ── */}
      <StaggerBody animKey={project.id}>

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
                <div
                  key={m.label}
                  style={m.highlight ? S.metricCardHighlight : S.metricCard}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
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
              {project.stack.map((name) => (
                <StackPill key={name} stackName={name} />
              ))}
            </div>
          </div>
        )}

        {/* Project details */}
        <div>
          <div style={S.sectionLabel}>Project details</div>
          <div style={S.metaStrip}>
            {metaCells.map(({ Icon, val, label }, i) => (
              <div
                key={label}
                style={{
                  ...S.metaCell,
                  borderRight: i < metaCells.length - 1 ? `1px solid ${T.border}` : "none",
                }}
              >
                <span style={{ color: T.terra, display: "flex" }}>
                  <Icon size={13} />
                </span>
                <div style={S.metaVal}>{val}</div>
                <div style={S.metaLbl}>{label}</div>
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
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <IconPlay size={11} /> View project
            </a>
          ) : (
            <button style={{ ...S.btnPrimary, opacity: 0.4, cursor: "not-allowed" }} disabled>
              <IconPlay size={11} /> View project
            </button>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={S.btnSecondary}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.cream; e.currentTarget.style.borderColor = T.borderHard; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <IconGitHub size={14} /> View code
            </a>
          )}
        </div>

        {/* Impact quote */}
        <div style={S.quote}>
          <p style={S.quoteText}>{project.impact}</p>
          <div style={S.quoteAttr}>Impact</div>
        </div>

      </StaggerBody>
    </div>
  );
}

/* ─── TRANSITION DURATIONS ───────────────────────────────────────────── */
const EXIT_DURATION = 280;
const LOCK_DURATION = EXIT_DURATION + 420;

/* ─── ROOT ───────────────────────────────────────────────────────────── */
export default function PortfolioShowcase() {
  const [panels, setPanels] = useState(() => [
    { project: PROJECTS[0], animState: "idle" },
  ]);

  const activeId         = panels[panels.length - 1].project.id;
  const detailScrollRef  = useRef(null);
  const navListRef       = useRef(null);
  const lockedRef        = useRef(false);
  const lastScrollTopRef = useRef(0);

  const selectProject = useCallback((id, fromScroll = false) => {
    if (id === activeId || lockedRef.current) return;
    lockedRef.current = true;
    const newProject = PROJECTS.find((p) => p.id === id);
    if (!newProject) return;

    setPanels((prev) => {
      const updated = prev.map((p, i) =>
        i === prev.length - 1 ? { ...p, animState: "exiting" } : p
      );
      return [...updated, { project: newProject, animState: "entering" }];
    });

    setTimeout(() => {
      setPanels((prev) => prev.filter((p) => p.animState !== "exiting"));
    }, EXIT_DURATION);

    if (!fromScroll) {
      requestAnimationFrame(() => {
        detailScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
        const btn = navListRef.current?.querySelector(`[data-id="${id}"]`);
        btn?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    }

    setTimeout(() => {
      lastScrollTopRef.current = detailScrollRef.current?.scrollTop ?? 0;
      lockedRef.current = false;
    }, LOCK_DURATION);
  }, [activeId]);

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

  useEffect(() => {
    const el = detailScrollRef.current;
    if (!el) return;
    lastScrollTopRef.current = 0;
    const onScroll = () => {
      if (lockedRef.current) return;
      const st        = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const prev      = lastScrollTopRef.current;
      if (Math.abs(st - prev) < 2) return;
      const down = st > prev;
      lastScrollTopRef.current = st;
      const idx = PROJECTS.findIndex((p) => p.id === activeId);
      if (down && st >= maxScroll - 4 && idx < PROJECTS.length - 1) {
        selectProject(PROJECTS[idx + 1].id, true);
        requestAnimationFrame(() => { el.scrollTop = 0; });
      } else if (!down && st <= 4 && idx > 0) {
        selectProject(PROJECTS[idx - 1].id, true);
        requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeId, selectProject]);

  return (
    <div style={S.root}>

      {/* ── Sidebar ── */}
      <aside style={S.sidebar}>
        <div style={S.sidebarHeader}>
          <div style={S.sidebarLabel}>Projects</div>
          <div style={S.sidebarCount}>{PROJECTS.length} projects — ↑↓ keys</div>
        </div>
        <div style={S.navList} ref={navListRef}>
          {PROJECTS.map((p, i) => (
            <NavItem
              key={p.id}
              project={p}
              index={i}
              active={p.id === activeId}
              onClick={() => selectProject(p.id)}
            />
          ))}
        </div>

        {/* Sidebar footer hint */}
        <div style={{
          padding: "12px 18px",
          borderTop: `1px solid ${T.border}`,
          fontSize: 10,
          color: T.muted,
          fontFamily: "'Cinzel', Georgia, serif",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          opacity: 0.7,
        }}>
          Scroll detail to navigate
        </div>
      </aside>

      {/* ── Detail area ── */}
      <div style={S.detail}>
        <div style={S.detailScroll} ref={detailScrollRef}>
          <div style={{ position: "relative", minHeight: "100%" }}>
            {panels.map(({ project, animState }) => (
              <DetailPanel
                key={project.id}
                project={project}
                idx={PROJECTS.findIndex((p) => p.id === project.id)}
                total={PROJECTS.length}
                animState={animState}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
