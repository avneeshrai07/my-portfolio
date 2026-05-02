"use client";

import React from "react";

const LBL = "text-[9px] uppercase tracking-[0.14em] font-medium block mb-1";

export default function ProjectCard({ data }) {
  return (
    /*
      Grid layout:
      ╔═══════════╦═══════════════╦═══════════════════════╗
      ║ Title/Sub ║               ║ Role, Duration, Status ║  row 1
      ╠═══════════╣    Image      ╠═══════════════════════╣
      ║  Impact   ║   (rows 1-2)  ║       Overview        ║  row 2
      ╠═══════════╩═══════════════╣     (rows 2-3)         ║
      ║      Tech Stack (cols 1+2)║                       ║  row 3
      ╚═══════════════════════════╩═══════════════════════╝

      Columns:  3fr | 4fr | 3fr
      Rows:     1.2fr | 1fr | 0.8fr
    */
    <div
      className="w-full flex flex-col overflow-hidden rounded-[10px]"
      style={{
        height: "50vh",
        maxHeight: "520px",
        minHeight: "320px",
        border: "1px solid var(--proj-border)",
      }}
    >
      {/* ── Main grid ── */}
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

        {/* ══ A1 — Title / Sub ══ */}
        <div
          className="flex flex-col justify-end overflow-hidden"
          style={{
            background: "var(--proj-cream)",
            gridColumn: 1, gridRow: 1,
            padding: "clamp(10px,1.2vw,18px)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="uppercase tracking-[0.12em]"
              style={{ fontSize: "clamp(7px,0.6vw,9px)", color: "var(--proj-ink-4)" }}
            >
              {data.category} · {data.type}
            </span>
            <span
              className="font-mono"
              style={{ fontSize: "clamp(7px,0.6vw,9px)", color: "var(--proj-border)" }}
            >
              {data.num}
            </span>
          </div>
          <div style={{ height: 1, background: "var(--proj-bark)", marginBottom: "clamp(6px,0.8vh,12px)" }} />
          <h2
            className="font-medium leading-none m-0"
            style={{
              fontSize: "clamp(24px,3.5vw,56px)",
              letterSpacing: "-0.04em",
              color: "var(--proj-ink)",
            }}
          >
            {data.name}
          </h2>
          <p
            className="font-medium mt-1 leading-snug"
            style={{ fontSize: "clamp(8px,0.75vw,11px)", color: "var(--proj-ink-3)" }}
          >
            {data.title}
          </p>
          <p
            className="mt-0.5"
            style={{ fontSize: "clamp(7px,0.65vw,10px)", color: "var(--proj-ink-4)", lineHeight: 1.6 }}
          >
            {data.sub}
          </p>
        </div>

        {/* ══ B — Image (rows 1–2) ══ */}
        <div
          className="relative overflow-hidden"
          style={{ gridColumn: 2, gridRow: "1 / 3", background: "#0a0a0a" }}
        >
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover"
            style={{ opacity: 0.6 }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, var(--proj-cream) 0%, transparent 15%, transparent 85%, var(--proj-cream) 100%)",
            }}
          />
        </div>

        {/* ══ C1 — Role, Duration, Status ══ */}
        <div
          className="flex flex-col justify-between overflow-hidden"
          style={{
            background: "var(--proj-cream)",
            gridColumn: 3, gridRow: 1,
            padding: "clamp(10px,1.2vw,18px)",
          }}
        >
          {/* Role */}
          <div>
            <span className={LBL} style={{ color: "var(--proj-bark-3)" }}>Role</span>
            <p style={{ fontSize: "clamp(8px,0.72vw,11px)", color: "var(--proj-ink-3)", lineHeight: 1.5 }}>
              {data.role}
            </p>
          </div>

          {/* Duration */}
          <div>
            <span className={LBL} style={{ color: "var(--proj-bark-3)" }}>Duration</span>
            <p style={{ fontSize: "clamp(8px,0.72vw,11px)", color: "var(--proj-ink-3)" }}>
              {data.duration} · {data.year}
            </p>
          </div>

          {/* Status */}
          <div>
            <span className={LBL} style={{ color: "var(--proj-bark-3)" }}>Status</span>
            <div className="flex items-center gap-1.5">
              <span
                className="rounded-full shrink-0 inline-block"
                style={{ width: 5, height: 5, background: "var(--proj-moss-tx)" }}
              />
              <span
                className="font-medium"
                style={{ fontSize: "clamp(8px,0.72vw,10px)", color: "var(--proj-moss-tx)", letterSpacing: "0.04em" }}
              >
                {data.status}
              </span>
            </div>
          </div>
        </div>

        {/* ══ A2 — Impact ══ */}
        <div
          className="flex flex-col justify-center overflow-hidden"
          style={{
            background: "var(--proj-cream)",
            gridColumn: 1, gridRow: 2,
            padding: "clamp(10px,1.2vw,18px)",
          }}
        >
          <span className={LBL} style={{ color: "var(--proj-bark-3)" }}>Impact</span>
          <p
            style={{
              fontSize: "clamp(8px,0.72vw,11px)",
              color: "var(--proj-ink-4)",
              lineHeight: 1.75,
              fontStyle: "italic",
              borderLeft: "1px solid var(--proj-border-2)",
              paddingLeft: "8px",
            }}
          >
            {data.impact}
          </p>
        </div>

        {/* ══ C — Overview (rows 2–3) ══ */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            background: "var(--proj-sand)",
            gridColumn: 3, gridRow: "2 / 4",
            padding: "clamp(10px,1.2vw,18px)",
          }}
        >
          <span className={LBL} style={{ color: "var(--proj-bark-3)" }}>Overview</span>
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            <p style={{ fontSize: "clamp(8px,0.72vw,11px)", color: "var(--proj-ink-3)", lineHeight: 1.82 }}>
              {data.overview}
            </p>
          </div>
        </div>

        {/* ══ A3+B3 — Tech Stack (cols 1+2, row 3) ══ */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            background: "var(--proj-cream)",
            gridColumn: "1 / 3", gridRow: 3,
            padding: "clamp(8px,1vw,14px)",
          }}
        >
          <span className={LBL} style={{ color: "var(--proj-bark-3)" }}>Tech Stack</span>
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            {/* flex-wrap with auto width per pill — flexible to word length */}
            <div className="flex flex-wrap gap-[5px]">
              {data.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono shrink-0"
                  style={{
                    fontSize: "clamp(7px,0.65vw,10px)",
                    color: "var(--proj-ink-3)",
                    border: "0.5px solid var(--proj-border-2)",
                    padding: "4px 10px",
                    borderRadius: "3px",
                    background: "var(--proj-sand)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <div
        className="shrink-0 flex items-center justify-between flex-wrap gap-1.5"
        style={{
          background: "var(--proj-sand-2)",
          borderTop: "1px solid var(--proj-border-2)",
          padding: "clamp(5px,0.6vh,9px) clamp(10px,1.2vw,18px)",
        }}
      >
        <div className="flex gap-1 flex-wrap">
          {data.tags.map((t) => (
            <span
              key={t.label}
              className="font-medium"
              style={{
                fontSize: "clamp(7px,0.6vw,8px)",
                padding: "2px 7px",
                borderRadius: "2px",
                letterSpacing: "0.06em",
                background: t.type === "live" ? "var(--proj-tag-live-bg)" : "var(--proj-sand)",
                border: `0.5px solid ${t.type === "live" ? "var(--proj-tag-live-bd)" : "var(--proj-border-2)"}`,
                color: t.type === "live" ? "var(--proj-tag-live-tx)" : "var(--proj-ink-3)",
              }}
            >
              {t.label}
            </span>
          ))}
        </div>
        <a
          href={data.href}
          className="transition-opacity hover:opacity-60"
          style={{
            fontSize: "clamp(7px,0.6vw,9px)",
            color: "var(--proj-bark)",
            textDecoration: "none",
            letterSpacing: "0.1em",
          }}
        >
          VIEW PROJECT →
        </a>
      </div>
    </div>
  );
}