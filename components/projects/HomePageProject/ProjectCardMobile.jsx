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
  const sheetRef  = useRef(null);  // outer — handles slide transform
  const scrollRef = useRef(null);  // inner — the scrollable body
  const startY    = useRef(null);
  const dragY     = useRef(0);
  const dragging  = useRef(false);

  useEffect(() => {
    const el       = sheetRef.current;
    const scrollEl = scrollRef.current;
    if (!el || !scrollEl) return;

    const onStart = (e) => {
      startY.current   = e.touches[0].clientY;
      dragY.current    = 0;
      dragging.current = false;
    };
    const onMove = (e) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      // Only intercept downward drag when the inner scroll area is at top
      if (dy > 0 && scrollEl.scrollTop <= 0) {
        e.preventDefault();
        dragging.current = true;
        dragY.current    = dy;
        el.style.transition = "none";
        el.style.transform  = `translateY(${dy}px)`;
      }
    };
    const onEnd = () => {
      if (dragging.current) {
        el.style.transition = "transform 0.32s cubic-bezier(0.16,1,0.3,1)";
        if (dragY.current > 110) onClose();
        else el.style.transform = "translateY(0)";
      }
      startY.current   = null;
      dragY.current    = 0;
      dragging.current = false;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove",  onMove,  { passive: false });
    el.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
    };
  }, [onClose]);

  useEffect(() => {
    const el       = sheetRef.current;
    const scrollEl = scrollRef.current;
    if (!el) return;
    if (open) {
      if (scrollEl) scrollEl.scrollTop = 0;
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
          zIndex: 50, background: "#FAF5EC",
          borderRadius: "20px 20px 0 0",
          maxHeight: "80vh",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 -4px 32px rgba(81,55,32,0.18)",
          border: "1px solid #D4B896", borderBottom: "none",
        }}
      >
        {/* ── Sticky drag pill — always visible ── */}
        <div style={{
          flexShrink: 0,
          display: "flex", justifyContent: "center",
          padding: "14px 0 10px",
          background: "#FAF5EC",
          borderBottom: "1px solid rgba(200,168,112,0.2)",
        }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "#C8A870", opacity: 0.5 }} />
        </div>

        {/* ── Scrollable body ── */}
        <div
          ref={scrollRef}
          style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain" }}
        >
        <div style={{ position: "relative", height: 180, margin: "0 16px", borderRadius: 16, overflow: "hidden" }}>
          <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(10,4,1,0.45) 45%, rgba(10,4,1,0.92) 100%)" }} />
          <div style={{ position: "absolute", bottom: 14, left: 14, right: 52 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.02em", textShadow: "0 2px 10px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.8)" }}>
              {project.name}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.82)", marginTop: 2, textShadow: "0 1px 5px rgba(0,0,0,0.85)" }}>{project.sub}</div>
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

          <p style={{ fontSize: 13, color: "#6b5e54", lineHeight: 1.7, margin: "0 0 22px" }}>{project.overview}</p>

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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
            {[
              { icon: "📅", val: project.duration, label: "Duration" },
              { icon: "✨", val: project.year,     label: "Year"     },
              { icon: "🚀", val: project.status,   label: "Status"   },
              { icon: "👤", val: "Solo",            label: "Team"     },
            ].map((m) => (
              <div key={m.label} style={metaCell}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1a0d06", textAlign: "center" }}>{m.val}</div>
                <div style={{ fontSize: 10, color: "#b0a494" }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={btnPrimary}>▶ View project</a>
            ) : (
              <button style={{ ...btnPrimary, opacity: 0.45, cursor: "not-allowed" }} disabled>▶ View project</button>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={btnSecondary}>{"</>"} Code</a>
            )}
          </div>

          <div style={quoteBox}>
            <p style={{ fontSize: 13, color: "#5A3E28", fontStyle: "italic", lineHeight: 1.65, margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{project.impact}</p>
            <div style={{ fontSize: 9, color: "#9A6A48", marginTop: 6, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Cinzel', Georgia, serif" }}>Impact</div>
          </div>

        </div>
        </div>{/* end scrollRef */}
      </div>{/* end sheetRef */}
    </>
  );
}

/* ─── SHARED SHEET STYLES ───────────────────────────────────────────── */
const sheetLabel     = { fontSize: 9, fontWeight: 700, color: "#9A6A48", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10, fontFamily: "'Cinzel', Georgia, serif" };
const featureRow     = { display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#F5EDE0", borderRadius: 12, border: "1px solid #DDD0B8" };
const featureIconBox = { width: 32, height: 32, borderRadius: 8, background: "#FAF5EC", border: "1px solid #DDD0B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 };
const metricCard     = { background: "#F5EDE0", border: "1px solid #DDD0B8", borderRadius: 10, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 };
const metricHighlight = { background: "#C4694A", border: "1px solid #C4694A", borderRadius: 10, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, boxShadow: "0 4px 14px rgba(196,105,74,0.3)" };
const metaCell       = { background: "#F5EDE0", border: "1px solid #DDD0B8", borderRadius: 10, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 };
const stackPill      = { display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px 4px 6px", borderRadius: 99, background: "#F5EDE0", border: "1px solid #DDD0B8" };
const btnPrimary     = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", borderRadius: 12, background: "#513720", color: "#FAF5EC", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textDecoration: "none" };
const btnSecondary   = { flex: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 20px", borderRadius: 12, background: "transparent", color: "#513720", border: "1px solid #C8A870", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textDecoration: "none", whiteSpace: "nowrap" };
const quoteBox       = { padding: "14px 16px", background: "#F5EDE0", borderRadius: 12, borderLeft: "3px solid #C4694A" };

/* ─── HERO CARD — split design ──────────────────────────────────────── */
function HeroCard({ project, animState, enterDir, onTap, idx, total }) {
  const [pressed, setPressed] = useState(false);
  const isLive = project.status === "Production";

  const cardClass =
    animState === "entering"       ? (enterDir === "right" ? "mpm-enter-right" : "mpm-enter")
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
        borderRadius: 22,
        overflow: "hidden",
        background: "#FAF5EC",
        border: "1px solid #DDD0B8",
        boxShadow: "0 4px 24px rgba(81,55,32,0.10)",
        display: "flex",
        flexDirection: "column",
        transform: pressed ? "scale(0.985)" : "scale(1)",
        transition: "transform 0.18s ease",
        willChange: "transform",
      }}
    >
      {/* ── Image zone: clean, no text overlay ── */}
      <div style={{ position: "relative", height: 185, flexShrink: 0, overflow: "hidden" }}>
        <img
          src={project.image}
          alt={project.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* Status badge — top left */}
        {isLive ? (
          <div style={{
            position: "absolute", top: 12, left: 12,
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(232,240,220,0.92)", backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            borderRadius: 99, padding: "4px 11px",
            fontSize: 10, fontWeight: 700, color: "#3A6820",
            fontFamily: "'Cinzel', Georgia, serif", letterSpacing: "0.06em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5A9A30", display: "inline-block", animation: "mpm-pulse 2s ease-in-out infinite" }} />
            Live
          </div>
        ) : (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(0,0,0,0.30)", backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            borderRadius: 99, padding: "4px 11px",
            fontSize: 10, color: "rgba(255,255,255,0.75)",
            border: "0.5px solid rgba(255,255,255,0.15)",
          }}>
            {project.year}
          </div>
        )}

        {/* Counter badge — top right */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(0,0,0,0.30)", backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: 99, padding: "4px 11px",
          fontSize: 11, color: "rgba(255,255,255,0.75)",
          fontFamily: "'Cinzel', Georgia, serif", letterSpacing: "0.06em",
          border: "0.5px solid rgba(255,255,255,0.12)",
        }}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      {/* ── Content zone: clean parchment background ── */}
      <div style={{
        flex: 1,
        padding: "13px 17px 15px",
        borderTop: "1px solid #DDD0B8",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        minHeight: 0,
      }}>

        {/* Category */}
        <div style={{
          fontSize: 9, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "#C4694A",
          fontFamily: "'Cinzel', Georgia, serif",
        }}>
          {project.category}
        </div>

        {/* Title */}
        <div style={{
          fontSize: 21, fontWeight: 400,
          color: "#2A1608",
          fontFamily: "'DM Serif Display', Georgia, serif",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}>
          {project.name}
        </div>

        {/* Description — 2-line clamp */}
        <div style={{
          fontSize: 13,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: "#9A6A48",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {project.sub}
        </div>

        {/* Stack pills — max 3 visible + overflow count */}
        {project.stack?.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "nowrap", overflow: "hidden" }}>
            {project.stack.slice(0, 3).map((name) => {
              const tech = resolveTech(name);
              return (
                <div key={name} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "3px 9px 3px 6px", borderRadius: 99,
                  background: "#EDE0CC", border: "1px solid #DDD0B8",
                  flexShrink: 0,
                }}>
                  <StackIcon name={tech.iconName} style={{ width: 13, height: 13, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#513720" }}>{tech.name}</span>
                </div>
              );
            })}
            {project.stack.length > 3 && (
              <div style={{
                padding: "3px 9px", borderRadius: 99,
                fontSize: 11, fontWeight: 600,
                color: "#9A6A48",
                background: "transparent",
                border: "1px solid #DDD0B8",
                flexShrink: 0,
                fontFamily: "'Cinzel', Georgia, serif",
                letterSpacing: "0.04em",
              }}>
                +{project.stack.length - 3}
              </div>
            )}
          </div>
        )}

        {/* CTA — anchored to bottom */}
        <div style={{ marginTop: "auto" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 14px",
            background: "#513720",
            borderRadius: 11,
            color: "#FDFAF6",
            fontSize: 13, fontWeight: 600,
            letterSpacing: "0.01em",
          }}>
            <span>View details</span>
            <span style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "rgba(255,255,255,0.14)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12,
            }}>→</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── DOT INDICATORS ────────────────────────────────────────────────── */
function DotIndicators({ total, active }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === active ? 18 : 6, height: 6, borderRadius: 99,
          background: i === active ? "#513720" : "#D8CFC4",
          transition: "width 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease",
        }} />
      ))}
    </div>
  );
}

/* ─── ROOT ──────────────────────────────────────────────────────────── */
export default function PortfolioShowcaseMobile() {
  const [panels, setPanels]     = useState(() => [{ project: PROJECTS[0], animState: "idle", enterDir: "left" }]);
  const [sheetOpen, setSheetOpen]     = useState(false);
  const [sheetProject, setSheetProject] = useState(null);
  const lockedRef = useRef(false);

  const activeIdx = PROJECTS.findIndex((p) => p.id === panels[panels.length - 1].project.id);

  const goTo = useCallback((newIdx, direction = "left") => {
    if (newIdx < 0 || newIdx >= PROJECTS.length || lockedRef.current) return;
    lockedRef.current = true;
    const newProject = PROJECTS[newIdx];
    const exitState  = direction === "left" ? "exiting-left" : "exiting-right";

    setPanels((prev) => {
      const updated = prev.map((p, i) => i === prev.length - 1 ? { ...p, animState: exitState } : p);
      return [...updated, { project: newProject, animState: "entering", enterDir: direction }];
    });
    setTimeout(() => setPanels((prev) => prev.filter((p) => p.animState !== exitState)), EXIT_MS);
    setTimeout(() => { lockedRef.current = false; }, LOCK_MS);
  }, []);

  const goNext = useCallback(() => goTo(activeIdx + 1, "left"),  [activeIdx, goTo]);
  const goPrev = useCallback(() => goTo(activeIdx - 1, "right"), [activeIdx, goTo]);

  const { onTouchStart, onTouchEnd } = useSwipe(goNext, goPrev);

  const openSheet  = (project) => { setSheetProject(project); setSheetOpen(true); };
  const closeSheet = () => setSheetOpen(false);

  return (
    <>
      <div style={{
        display: "flex", flexDirection: "column",
        background: "transparent",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        maxWidth: 480, margin: "0 auto",
        userSelect: "none", WebkitUserSelect: "none",
      }}>

        {/* ── Header ── */}
        <div style={{ padding: "22px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#B0926E", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Cinzel', Georgia, serif" }}>
              Projects
            </div>
            <div style={{ fontSize: 11, color: "#BFB0A0", marginTop: 3 }}>
              {PROJECTS.length} total · swipe to browse
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#B0926E", fontFamily: "'Cinzel', Georgia, serif", letterSpacing: "0.06em" }}>
            {activeIdx + 1} / {PROJECTS.length}
          </div>
        </div>

        {/* ── Card stage — taller to accommodate split layout ── */}
        <div
          style={{ position: "relative", margin: "0 16px", height: 400, borderRadius: 22 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {panels.map(({ project, animState, enterDir }) => {
            const idx = PROJECTS.findIndex((p) => p.id === project.id);
            return (
              <HeroCard
                key={project.id}
                project={project}
                animState={animState}
                enterDir={enterDir}
                idx={idx}
                total={PROJECTS.length}
                onTap={() => openSheet(project)}
              />
            );
          })}
        </div>

        {/* ── Dots + arrows ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "18px 20px 28px" }}>

          <button
            onClick={goPrev}
            disabled={activeIdx === 0}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent",
              border: "1px solid rgba(81,55,32,0.2)",
              cursor: activeIdx === 0 ? "default" : "pointer",
              opacity: activeIdx === 0 ? 0.25 : 1,
              flexShrink: 0,
              transition: "opacity 0.2s, border-color 0.2s",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M8.5 2L4 6.5L8.5 11" stroke="#513720" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <DotIndicators total={PROJECTS.length} active={activeIdx} />

          <button
            onClick={goNext}
            disabled={activeIdx === PROJECTS.length - 1}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: activeIdx === PROJECTS.length - 1 ? "transparent" : "#513720",
              border: "1px solid " + (activeIdx === PROJECTS.length - 1 ? "rgba(81,55,32,0.2)" : "#513720"),
              cursor: activeIdx === PROJECTS.length - 1 ? "default" : "pointer",
              opacity: activeIdx === PROJECTS.length - 1 ? 0.25 : 1,
              flexShrink: 0,
              transition: "opacity 0.2s, background 0.2s, border-color 0.2s",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M4.5 2L9 6.5L4.5 11" stroke={activeIdx === PROJECTS.length - 1 ? "#513720" : "#fff"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>
      </div>

      {/* ── Bottom Sheet ── */}
      <BottomSheet project={sheetProject} open={sheetOpen} onClose={closeSheet} />
    </>
  );
}