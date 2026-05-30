"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { projects as PROJECTS } from "@/types/projects";
import StackIcon from "tech-stack-icons";
import { techStack } from "@/types/techStack";

/* ─── TECH LOOKUP ───────────────────────────────────────────────────── */
const TECH_BY_NAME = Object.fromEntries(techStack.map((t) => [t.name.toLowerCase(), t]));
const TECH_ALIASES = {
  "next.js": "next.js", "node.js": "node.js",
  "aws s3": "aws", "socket.io": "socket.io",
  "postgresql": "postgresql", "go": "go",
};
function resolveTech(stackName) {
  const key = TECH_ALIASES[stackName.toLowerCase()] ?? stackName.toLowerCase();
  return TECH_BY_NAME[key] ?? { name: stackName, iconName: stackName.toLowerCase().replace(/[^a-z0-9]/g, ""), bubbleColor: "#888" };
}

/* ─── NAV META ──────────────────────────────────────────────────────── */
const NAV_META = {
  sunakku: { navIcon: "🛒", iconBg: "#fef0e6" },
  velox:   { navIcon: "📡", iconBg: "#e8f0fe" },
  gatekeeper: { navIcon: "🔐", iconBg: "#f0faf4" },
};
function getNavMeta(id) {
  return NAV_META[id] ?? { navIcon: "💻", iconBg: "#f5f0eb" };
}

const FEAT_ICONS = ["⚡", "🔀", "🔑", "📊", "🛡️", "🔁", "💾", "📋"];
const EXIT_MS = 260;
const LOCK_MS = EXIT_MS + 380;

/* ─── SWIPE HOOK ────────────────────────────────────────────────────── */
function useSwipe(onSwipeLeft, onSwipeRight) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [onSwipeLeft, onSwipeRight]);

  return { onTouchStart, onTouchEnd };
}

/* ─── BOTTOM SHEET ──────────────────────────────────────────────────── */
function BottomSheet({ project, open, onClose }) {
  const sheetRef  = useRef(null);
  const startY    = useRef(null);
  const dragY     = useRef(0);
  const dragging  = useRef(false);

  /* Attach non-passive touchmove so we can preventDefault when needed */
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;

    const onStart = (e) => {
      startY.current  = e.touches[0].clientY;
      dragY.current   = 0;
      dragging.current = false;
    };

    const onMove = (e) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      /* Only intercept a downward drag when the sheet is already scrolled to top */
      if (dy > 0 && el.scrollTop <= 0) {
        e.preventDefault();           // stop the browser scrolling the sheet up
        dragging.current = true;
        dragY.current = dy;
        el.style.transition = "none";
        el.style.transform  = `translateY(${dy}px)`;
      }
    };

    const onEnd = () => {
      if (dragging.current) {
        el.style.transition = "transform 0.32s cubic-bezier(0.16,1,0.3,1)";
        if (dragY.current > 110) {
          onClose();
        } else {
          el.style.transform = "translateY(0)";
        }
      }
      startY.current   = null;
      dragY.current    = 0;
      dragging.current = false;
    };

    el.addEventListener("touchstart", onStart,  { passive: true  });
    el.addEventListener("touchmove",  onMove,   { passive: false }); // must be non-passive
    el.addEventListener("touchend",   onEnd,    { passive: true  });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
    };
  }, [onClose]);

  /* Reset position and scroll every time the sheet opens */
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    if (open) {
      el.scrollTop = 0;
      el.style.transition = "transform 0.32s cubic-bezier(0.16,1,0.3,1)";
      el.style.transform  = "translateY(0)";
    }
  }, [open]);

  if (!project) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(26,10,2,0.5)",
          zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.28s ease",
        }}
      />
      <div
        ref={sheetRef}
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          width: "100%", maxWidth: "100vw",
          zIndex: 50,
          background: "#FAF5EC",
          borderRadius: "20px 20px 0 0",
          maxHeight: "88vh",
          overflowY: "auto",
          overscrollBehavior: "contain",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 -4px 32px rgba(81,55,32,0.18)",
          border: "1px solid var(--proj-border-2, #D4B896)",
          borderBottom: "none",
        }}
      >
        {/* drag pill */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 6px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "var(--proj-border, #C8A870)", opacity: 0.5 }} />
        </div>

        {/* hero thumb */}
        <div style={{ position: "relative", height: 180, margin: "0 16px", borderRadius: 16, overflow: "hidden" }}>
          <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)" }} />
          <div style={{ position: "absolute", bottom: 14, left: 14 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.02em" }}>
              {project.name}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>{project.sub}</div>
          </div>
          {project.status === "Production" && (
            <div style={{
              position: "absolute", top: 12, right: 12,
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
              borderRadius: 99, padding: "4px 10px",
              fontSize: 10, fontWeight: 600, color: "#fff",
              border: "0.5px solid rgba(255,255,255,0.2)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "mpm-pulse 2s ease-in-out infinite" }} />
              Live
            </div>
          )}
        </div>

        <div style={{ padding: "20px 20px 40px" }}>

          {/* Overview */}
          <p style={{ fontSize: 13, color: "#6b5e54", lineHeight: 1.7, margin: "0 0 22px" }}>{project.overview}</p>

          {/* Features */}
          {project.features?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={sheetLabel}>Key features</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {project.features.map((f, i) => (
                  <div key={f.title} style={featureRow}>
                    <div style={featureIconBox}>{FEAT_ICONS[i % FEAT_ICONS.length]}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#1a0d06" }}>{f.title}</div>
                      <div style={{ fontSize: 11, color: "#9a8c7e", marginTop: 1, lineHeight: 1.4 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {project.metrics?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={sheetLabel}>Performance</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {project.metrics.map((m) => (
                  <div key={m.label} style={m.highlight ? metricHighlight : metricCard}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: m.highlight ? "#fff" : "#1a0d06", textAlign: "center" }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: m.highlight ? "rgba(255,255,255,0.6)" : "#b0a494", textAlign: "center" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stack */}
          {project.stack?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={sheetLabel}>Built with</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.stack.map((name) => {
                  const tech = resolveTech(name);
                  return (
                    <div key={name} style={stackPill}>
                      <StackIcon name={tech.iconName} style={{ width: 16, height: 16, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: "#1a0d06" }}>{tech.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Meta row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
            {[
              { icon: "📅", val: project.duration, label: "Duration" },
              { icon: "✨", val: project.year, label: "Year" },
              { icon: "🚀", val: project.status, label: "Status" },
              { icon: "👤", val: "Solo", label: "Team" },
            ].map((m) => (
              <div key={m.label} style={metaCell}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1a0d06", textAlign: "center" }}>{m.val}</div>
                <div style={{ fontSize: 10, color: "#b0a494" }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
                ▶ View project
              </a>
            ) : (
              <button style={{ ...btnPrimary, opacity: 0.45, cursor: "not-allowed" }} disabled>▶ View project</button>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={btnSecondary}>
                {"</>"} Code
              </a>
            )}
          </div>

          {/* Impact quote */}
          <div style={quoteBox}>
            <p style={{ fontSize: 13, color: "#5A3E28", fontStyle: "italic", lineHeight: 1.65, margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{project.impact}</p>
            <div style={{ fontSize: 9, color: "#9A6A48", marginTop: 6, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Cinzel', Georgia, serif" }}>Impact</div>
          </div>

        </div>
      </div>
    </>
  );
}

/* ─── SHARED SHEET STYLES ───────────────────────────────────────────── */
const sheetLabel  = { fontSize: 9, fontWeight: 700, color: "#9A6A48", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, fontFamily: "'Cinzel', Georgia, serif" };
const featureRow  = { display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#F5EDE0", borderRadius: 12, border: "1px solid #DDD0B8" };
const featureIconBox = { width: 32, height: 32, borderRadius: 8, background: "#FAF5EC", border: "1px solid #DDD0B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 };
const metricCard  = { background: "#F5EDE0", border: "1px solid #DDD0B8", borderRadius: 10, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 };
const metricHighlight = { background: "#C4694A", border: "1px solid #C4694A", borderRadius: 10, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, boxShadow: "0 4px 14px rgba(196,105,74,0.3)" };
const metaCell    = { background: "#F5EDE0", border: "1px solid #DDD0B8", borderRadius: 10, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 };
const stackPill   = { display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px 4px 6px", borderRadius: 99, background: "#F5EDE0", border: "1px solid #DDD0B8" };
const btnPrimary  = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", borderRadius: 12, background: "#513720", color: "#FAF5EC", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textDecoration: "none" };
const btnSecondary = { flex: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 20px", borderRadius: 12, background: "transparent", color: "#513720", border: "1px solid #C8A870", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textDecoration: "none", whiteSpace: "nowrap" };
const quoteBox     = { padding: "14px 16px", background: "#F5EDE0", borderRadius: 12, borderLeft: "3px solid #C4694A" };

/* ─── HERO CARD ─────────────────────────────────────────────────────── */
function HeroCard({ project, animState, enterDir, onTap }) {
  const [pressed, setPressed] = useState(false);
  const isLive = project.status === "Production";
  const { navIcon } = getNavMeta(project.id);

  const cardClass =
    animState === "entering"      ? (enterDir === "right" ? "mpm-enter-right" : "mpm-enter")
    : animState === "exiting-left"  ? "mpm-exit-left"
    : animState === "exiting-right" ? "mpm-exit-right"
    : "";

  return (
    <div
      className={cardClass}
      onClick={onTap}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        position: "absolute", inset: 0,
        cursor: "pointer",
        transform: pressed ? "scale(0.985)" : "scale(1)",
        transition: "transform 0.18s ease",
        willChange: "transform",
      }}
    >
      {/* Full-bleed image */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden" }}>
        <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.78) 100%)",
        }} />
      </div>

      {/* Top badges */}
      <div style={{ position: "absolute", top: 18, left: 18, right: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)", border: "0.5px solid rgba(255,255,255,0.2)",
          borderRadius: 99, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#fff",
        }}>
          <span>{navIcon}</span>
          {project.name}
        </div>
        {isLive ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 99,
            padding: "5px 11px", fontSize: 10, fontWeight: 600, color: "#fff",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "mpm-pulse 2s ease-in-out infinite" }} />
            Live
          </div>
        ) : (
          <div style={{
            background: "rgba(0,0,0,0.28)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            borderRadius: 99, padding: "5px 11px", fontSize: 10, color: "rgba(255,255,255,0.7)",
            border: "0.5px solid rgba(255,255,255,0.15)",
          }}>
            {project.year}
          </div>
        )}
      </div>

      {/* Bottom content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 22px 22px" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          {project.name}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.4 }}>
          {project.sub}
        </div>

        {/* Stack preview pills */}
        {project.stack?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
            {project.stack.slice(0, 4).map((name) => {
              const tech = resolveTech(name);
              return (
                <div key={name} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 9px 4px 6px", borderRadius: 99,
                  background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
                }}>
                  <StackIcon name={tech.iconName} style={{ width: 14, height: 14, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>{tech.name}</span>
                </div>
              );
            })}
            {project.stack.length > 4 && (
              <div style={{
                padding: "4px 9px", borderRadius: 99, fontSize: 10, color: "rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.15)",
              }}>+{project.stack.length - 4}</div>
            )}
          </div>
        )}

        {/* Tap hint */}
        <div style={{
          marginTop: 18, display: "flex", alignItems: "center", gap: 8,
          padding: "10px 16px", background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
          border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 12,
        }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>Tap for details</span>
          <span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginLeft: "auto" }}>↗</span>
        </div>
      </div>
    </div>
  );
}

/* ─── DOT INDICATORS ────────────────────────────────────────────────── */
function DotIndicators({ total, active }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingTop: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === active ? 18 : 6, height: 6, borderRadius: 99,
          background: i === active ? "#1a0d06" : "#d8cfc4",
          transition: "width 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease",
        }} />
      ))}
    </div>
  );
}

/* ─── ROOT ──────────────────────────────────────────────────────────── */
export default function PortfolioShowcaseMobile() {
  const [panels, setPanels] = useState(() => [{ project: PROJECTS[0], animState: "idle", enterDir: "left" }]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetProject, setSheetProject] = useState(null);
  const lockedRef = useRef(false);

  const activeIdx = PROJECTS.findIndex((p) => p.id === panels[panels.length - 1].project.id);
  const activeId  = PROJECTS[activeIdx]?.id;

  const goTo = useCallback((newIdx, direction = "left") => {
    if (newIdx < 0 || newIdx >= PROJECTS.length || lockedRef.current) return;
    lockedRef.current = true;
    const newProject = PROJECTS[newIdx];
    const exitState  = direction === "left" ? "exiting-left" : "exiting-right";

    setPanels((prev) => {
      const updated = prev.map((p, i) => i === prev.length - 1 ? { ...p, animState: exitState } : p);
      return [...updated, { project: newProject, animState: "entering", enterDir: direction }];
    });
    setTimeout(() => {
      setPanels((prev) => prev.filter((p) => p.animState !== exitState));
    }, EXIT_MS);
    setTimeout(() => { lockedRef.current = false; }, LOCK_MS);
  }, []);

  const goNext = useCallback(() => goTo(activeIdx + 1, "left"), [activeIdx, goTo]);
  const goPrev = useCallback(() => goTo(activeIdx - 1, "right"), [activeIdx, goTo]);

  const { onTouchStart, onTouchEnd } = useSwipe(goNext, goPrev);

  const openSheet = (project) => { setSheetProject(project); setSheetOpen(true); };
  const closeSheet = () => setSheetOpen(false);

  return (
    <>
      <div style={{
        display: "flex", flexDirection: "column",
        background: "transparent",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        maxWidth: 480, margin: "0 auto",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}>

        {/* ── Header ── */}
        <div style={{ padding: "22px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#a09488", letterSpacing: "0.07em", textTransform: "uppercase" }}>Projects</div>
            <div style={{ fontSize: 11, color: "#bbb0a4", marginTop: 2 }}>{PROJECTS.length} total · swipe to browse</div>
          </div>
          <div style={{ fontSize: 12, color: "#b0a494", fontVariantNumeric: "tabular-nums" }}>
            {activeIdx + 1} / {PROJECTS.length}
          </div>
        </div>

        {/* ── Card stage ── */}
        <div
          style={{ flex: "0 0 auto", position: "relative", margin: "0 16px", height: 340, borderRadius: 24 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {panels.map(({ project, animState, enterDir }) => (
            <HeroCard
              key={project.id}
              project={project}
              animState={animState}
              enterDir={enterDir}
              onTap={() => openSheet(project)}
            />
          ))}
        </div>

        {/* ── Dots ── */}
        <div style={{ padding: "14px 20px 0" }}>
          <DotIndicators total={PROJECTS.length} active={activeIdx} />
        </div>

        {/* ── Nav arrows ── */}
        <div style={{ display: "flex", gap: 10, padding: "16px 16px 24px" }}>
          <button
            onClick={goPrev}
            disabled={activeIdx === 0}
            style={{
              flex: 1, padding: "13px 0", borderRadius: 14,
              background: activeIdx === 0 ? "rgba(81,55,32,0.06)" : "rgba(81,55,32,0.1)",
              border: "1px solid " + (activeIdx === 0 ? "rgba(81,55,32,0.1)" : "rgba(81,55,32,0.22)"),
              fontSize: 18, cursor: activeIdx === 0 ? "default" : "pointer",
              color: activeIdx === 0 ? "rgba(81,55,32,0.3)" : "var(--suit-brown)",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            ←
          </button>
          <button
            onClick={goNext}
            disabled={activeIdx === PROJECTS.length - 1}
            style={{
              flex: 1, padding: "13px 0", borderRadius: 14,
              background: activeIdx === PROJECTS.length - 1 ? "rgba(81,55,32,0.06)" : "var(--suit-brown)",
              border: "1px solid " + (activeIdx === PROJECTS.length - 1 ? "rgba(81,55,32,0.1)" : "var(--suit-brown)"),
              fontSize: 18, cursor: activeIdx === PROJECTS.length - 1 ? "default" : "pointer",
              color: activeIdx === PROJECTS.length - 1 ? "rgba(81,55,32,0.3)" : "#fff",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            →
          </button>
        </div>

      </div>

      {/* ── Bottom Sheet ── */}
      <BottomSheet project={sheetProject} open={sheetOpen} onClose={closeSheet} />
    </>
  );
}