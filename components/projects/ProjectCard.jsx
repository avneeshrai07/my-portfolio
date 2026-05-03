"use client";

import React, { useEffect } from "react";

const LBL = "uppercase tracking-[0.14em] font-semibold block mb-2";

const injectStyles = () => {
  if (typeof document === "undefined") return;
  const id = "proj-card-styles";
  if (document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id;
  el.textContent = `
    @keyframes proj-fade-up {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes proj-img-in {
      from { opacity: 0; transform: scale(1.08); }
      to   { opacity: 0.62; transform: scale(1); }
    }
    @keyframes proj-img-in-mobile {
      from { opacity: 0; transform: scale(1.06); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes proj-pill-pop {
      from { opacity: 0; transform: scale(0.82) translateY(6px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes proj-tag-slide {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .proj-card-root {
      animation: proj-fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
      transition: transform 0.32s cubic-bezier(0.22,1,0.36,1),
                  box-shadow 0.32s cubic-bezier(0.22,1,0.36,1);
    }
    .proj-card-root:hover {
      transform: translateY(-4px);
      box-shadow: 0 24px 60px rgba(0,0,0,0.13), 0 6px 16px rgba(0,0,0,0.07);
    }

    .proj-img-el {
      animation: proj-img-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
      transition: transform 0.6s cubic-bezier(0.22,1,0.36,1),
                  opacity  0.6s cubic-bezier(0.22,1,0.36,1);
    }
    .proj-card-root:hover .proj-img-el {
      transform: scale(1.04);
      opacity: 0.75;
    }

    .proj-img-mobile {
      animation: proj-img-in-mobile 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
      transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
    }
    .proj-card-root:hover .proj-img-mobile {
      transform: scale(1.03);
    }

    .proj-s1 { animation: proj-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.06s both; }
    .proj-s2 { animation: proj-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.13s both; }
    .proj-s3 { animation: proj-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.20s both; }
    .proj-s4 { animation: proj-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.27s both; }

    .proj-pill {
      animation: proj-pill-pop 0.38s cubic-bezier(0.22,1,0.36,1) both;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .proj-pill:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.10);
    }

    .proj-tag {
      animation: proj-tag-slide 0.4s cubic-bezier(0.22,1,0.36,1) both;
    }

    .proj-view-link {
      position: relative;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .proj-view-link::after {
      content: '';
      position: absolute;
      left: 0; bottom: -2px;
      width: 100%; height: 0.5px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
    }
    .proj-view-link:hover::after {
      transform: scaleX(1);
      transform-origin: left;
    }
    .proj-view-link:hover { opacity: 0.65 !important; }
  `;
  document.head.appendChild(el);
};

/* ─────────────────────────────────────────
   DESKTOP CARD
───────────────────────────────────────── */
function DesktopCard({ data }) {
  return (
    <div
      className="proj-card-root w-full flex-col overflow-hidden rounded-[10px] hidden md:flex"
      style={{
        height: "72vh",
        maxHeight: "700px",
        minHeight: "440px",
        border: "1px solid var(--proj-border)",
      }}
    >
      <div
        className="flex-1 min-h-0"
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 4fr 3fr",
          gridTemplateRows: "1.2fr 1fr 0.8fr",
          gap: "1px",
          background: "var(--proj-border-2)",
        }}
      >
        {/* A1 — Title */}
        <div
          className="proj-s1 flex flex-col justify-end overflow-hidden"
          style={{ background: "var(--proj-cream)", gridColumn: 1, gridRow: 1, padding: "clamp(16px,1.6vw,28px)" }}
        >
          <h2 className="font-medium leading-none m-0" style={{ fontSize: "clamp(28px,3.2vw,62px)", letterSpacing: "-0.04em", color: "var(--suit-brown)" }}>
            {data.name}
          </h2>
          <p className="font-medium mt-2 leading-snug" style={{ fontSize: "clamp(12px,1vw,15px)", color: "var(--proj-ink-3)" }}>
            {data.title}
          </p>
          <p className="mt-1" style={{ fontSize: "clamp(11px,0.88vw,14px)", color: "var(--proj-ink-4)", lineHeight: 1.65 }}>
            {data.sub}
          </p>
        </div>

        {/* B — Image rows 1–2 */}
        <div className="relative overflow-hidden" style={{ gridColumn: 2, gridRow: "1 / 3", background: "var(--suit-brown)" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CDN_URL}${data.image}`}
            alt={data.name}
            className="proj-img-el w-full h-full object-cover"
            style={{ opacity: 0.62 }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, var(--proj-cream) 0%, transparent 12%, transparent 88%, var(--proj-cream) 100%)" }} />
        </div>

        {/* C1 — Meta */}
        <div
          className="proj-s2 flex flex-col overflow-hidden"
          style={{ background: "var(--proj-cream)", gridColumn: 3, gridRow: 1, padding: "clamp(16px,1.6vw,28px)" }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar flex flex-col justify-between">
            {[
              { label: "Role", value: data.role },
              { label: "Status", value: data.status },
              { label: "Duration", value: data.duration },
              { label: "Year", value: data.year },
            ].map(({ label, value }) => (
              <p key={label} style={{ fontSize: "clamp(12px,0.95vw,15px)", color: "var(--proj-ink-3)", lineHeight: 1.5, wordBreak: "break-word" }}>
                <span style={{ color: "var(--proj-bark-3)", fontWeight: 700, letterSpacing: "0.09em", fontSize: "clamp(9px,0.78vw,12px)", textTransform: "uppercase", marginRight: "0.4em" }}>
                  {label}:
                </span>
                {value}
              </p>
            ))}
          </div>
        </div>

        {/* A2 — Impact */}
        <div
          className="proj-s3 flex flex-col overflow-hidden"
          style={{ background: "var(--proj-cream)", gridColumn: 1, gridRow: 2, padding: "clamp(14px,1.4vw,24px)" }}
        >
          <span className={LBL} style={{ color: "var(--proj-bark-3)", fontSize: "clamp(9px,0.78vw,11px)" }}>Impact</span>
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            <p style={{ fontSize: "clamp(12px,0.95vw,15px)", color: "var(--suit-brown)", lineHeight: 1.8, fontStyle: "italic", borderLeft: "1.5px solid var(--proj-border-2)", paddingLeft: "10px" }}>
              {data.impact}
            </p>
          </div>
        </div>

        {/* C — Overview rows 2–3 */}
        <div
          className="proj-s3 flex flex-col overflow-hidden"
          style={{ background: "var(--proj-sand)", gridColumn: 3, gridRow: "2 / 4", padding: "clamp(14px,1.4vw,24px)" }}
        >
          <span className={LBL} style={{ color: "var(--proj-bark-3)", fontSize: "clamp(9px,0.78vw,11px)" }}>Overview</span>
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            <p style={{ fontSize: "clamp(12px,0.95vw,15px)", color: "var(--suit-brown)", lineHeight: 1.9 }}>{data.overview}</p>
          </div>
        </div>

        {/* A3+B3 — Tech Stack */}
        <div
          className="proj-s4 flex flex-col overflow-hidden"
          style={{ background: "var(--proj-cream)", gridColumn: "1 / 3", gridRow: 3, padding: "clamp(12px,1.2vw,20px)" }}
        >
          <span className={LBL} style={{ color: "var(--proj-bark-3)", fontSize: "clamp(9px,0.78vw,11px)" }}>Tech Stack</span>
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            <div className="flex flex-wrap gap-[6px]">
              {data.stack.map((s, i) => (
                <span
                  key={s}
                  className="proj-pill font-mono shrink-0"
                  style={{
                    fontSize: "clamp(10px,0.85vw,13px)", color: "var(--suit-brown)",
                    border: "0.5px solid var(--proj-border-2)", padding: "5px 13px",
                    borderRadius: "3px", background: "var(--proj-sand)", whiteSpace: "nowrap",
                    animationDelay: `${0.30 + i * 0.05}s`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="shrink-0 flex items-center justify-between flex-wrap gap-2"
        style={{ background: "var(--proj-sand-2)", borderTop: "1px solid var(--proj-border-2)", padding: "clamp(8px,0.8vh,14px) clamp(14px,1.4vw,24px)" }}
      >
        <div className="flex gap-1.5 flex-wrap">
          {data.tags.map((t, i) => (
            <span
              key={t.label}
              className="proj-tag font-medium"
              style={{
                fontSize: "clamp(9px,0.78vw,11px)", padding: "3px 9px", borderRadius: "2px", letterSpacing: "0.06em",
                background: t.type === "live" ? "var(--proj-tag-live-bg)" : "var(--proj-sand)",
                border: `0.5px solid ${t.type === "live" ? "var(--proj-tag-live-bd)" : "var(--proj-border-2)"}`,
                color: t.type === "live" ? "var(--proj-tag-live-tx)" : "var(--proj-ink-3)",
                animationDelay: `${0.42 + i * 0.07}s`,
              }}
            >
              {t.label}
            </span>
          ))}
        </div>
        <a href={data.href} className="proj-view-link" style={{ fontSize: "clamp(10px,0.82vw,13px)", color: "var(--proj-bark)", letterSpacing: "0.1em" }}>
          VIEW PROJECT →
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MOBILE CARD — hero image + title overlay
   + sub + overview + stack + footer
   NO: impact, role, status, duration, year
───────────────────────────────────────── */
function MobileCard({ data }) {
  return (
    <div
      className="proj-card-root w-full flex flex-col overflow-hidden rounded-[10px] md:hidden"
      style={{ border: "1px solid var(--proj-border)" }}
    >
      {/* Hero image — full width */}
      <div
        className="relative overflow-hidden w-full flex-shrink-0"
        style={{ height: "56vw", minHeight: "210px", maxHeight: "300px", background: "var(--suit-brown)" }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_CDN_URL}${data.image}`}
          alt={data.name}
          className="proj-img-mobile w-full h-full object-cover"
        />
        {/* gradient: transparent top → cream bottom so title reads cleanly */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 35%, var(--proj-cream) 100%)" }}
        />
        {/* Name + subtitle pinned to bottom of image */}
        <div className="proj-s1 absolute bottom-0 left-0 right-0" style={{ padding: "18px 18px 16px" }}>
          <h2
            className="font-medium leading-none m-0"
            style={{ fontSize: "clamp(28px,8vw,42px)", letterSpacing: "-0.04em", color: "var(--suit-brown)" }}
          >
            {data.name}
          </h2>
          <p className="font-medium mt-1.5" style={{ fontSize: "13px", color: "var(--proj-ink-3)", lineHeight: 1.4 }}>
            {data.title}
          </p>
        </div>
      </div>

      {/* Sub description */}
      <div className="proj-s2" style={{ background: "var(--proj-cream)", padding: "14px 18px 0" }}>
        <p style={{ fontSize: "13.5px", color: "var(--proj-ink-4)", lineHeight: 1.75 }}>
          {data.sub}
        </p>
      </div>

      {/* Overview */}
      <div className="proj-s3" style={{ background: "var(--proj-cream)", padding: "16px 18px 0" }}>
        <span className={LBL} style={{ color: "var(--proj-bark-3)", fontSize: "10px" }}>Overview</span>
        <p style={{ fontSize: "13.5px", color: "var(--suit-brown)", lineHeight: 1.85 }}>
          {data.overview}
        </p>
      </div>

      {/* Tech Stack */}
      <div className="proj-s4" style={{ background: "var(--proj-cream)", padding: "16px 18px 18px" }}>
        <span className={LBL} style={{ color: "var(--proj-bark-3)", fontSize: "10px" }}>Tech Stack</span>
        <div className="flex flex-wrap gap-[6px]">
          {data.stack.map((s, i) => (
            <span
              key={s}
              className="proj-pill font-mono"
              style={{
                fontSize: "11px", color: "var(--suit-brown)",
                border: "0.5px solid var(--proj-border-2)", padding: "4px 11px",
                borderRadius: "3px", background: "var(--proj-sand)", whiteSpace: "nowrap",
                animationDelay: `${0.28 + i * 0.05}s`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="shrink-0 flex items-center justify-between flex-wrap gap-2"
        style={{ background: "var(--proj-sand-2)", borderTop: "1px solid var(--proj-border-2)", padding: "10px 18px" }}
      >
        <div className="flex gap-1.5 flex-wrap">
          {data.tags.map((t, i) => (
            <span
              key={t.label}
              className="proj-tag font-medium"
              style={{
                fontSize: "10px", padding: "3px 9px", borderRadius: "2px", letterSpacing: "0.06em",
                background: t.type === "live" ? "var(--proj-tag-live-bg)" : "var(--proj-sand)",
                border: `0.5px solid ${t.type === "live" ? "var(--proj-tag-live-bd)" : "var(--proj-border-2)"}`,
                color: t.type === "live" ? "var(--proj-tag-live-tx)" : "var(--proj-ink-3)",
                animationDelay: `${0.38 + i * 0.07}s`,
              }}
            >
              {t.label}
            </span>
          ))}
        </div>
        <a href={data.href} className="proj-view-link" style={{ fontSize: "11px", color: "var(--proj-bark)", letterSpacing: "0.1em" }}>
          VIEW PROJECT →
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EXPORT
───────────────────────────────────────── */
export default function ProjectCard({ data }) {
  useEffect(() => { injectStyles(); }, []);
  return (
    <>
      <DesktopCard data={data} />
      <MobileCard  data={data} />
    </>
  );
}