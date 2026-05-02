"use client";

import React from "react";

const LBL = "text-[10px] uppercase tracking-[0.14em] font-medium block mb-1"; // 9px → 10px

export default function ProjectCard({ data }) {
  return (
    <div
      className="w-full flex flex-col overflow-hidden rounded-[10px]"
      style={{
        height: "50vh",
        maxHeight: "520px",
        minHeight: "320px",
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

        {/* ══ A1 — Title / Sub ══ */}
         <div
          className="flex flex-col justify-end overflow-hidden"
          style={{
            background: "var(--proj-cream)",
            gridColumn: 1, gridRow: 1,
            padding: "clamp(10px,1.2vw,18px)",
          }}
        >
        {/*
          <div className="flex items-center justify-between mb-2">
            <span
              className="uppercase tracking-[0.12em]"
              style={{ fontSize: "clamp(7px,0.6vw,9px)", color: "var(--proj-ink-4)" }} // 7→8, 0.6→0.7, 9→11
            >
              {data.category} · {data.type}
            </span>
            <span
              className="font-mono"
              style={{ fontSize: "clamp(8px,0.7vw,11px)", color: "var(--proj-border)" }} // 7→8, 0.6→0.7, 9→11
            >
              {data.num}
            </span>
          </div> */}
          <div style={{ height: 1, background: "var(--proj-bark)", marginBottom: "clamp(6px,0.8vh,12px)" }} />
          <h2
            className="font-medium leading-none m-0"
            style={{
              fontSize: "clamp(24px,3.5vw,56px)", // title stays same — already big
              letterSpacing: "-0.04em",
              color: "var(--suit-brown)",
            }}
          >
            {data.name}
          </h2>
          <p
            className="font-medium mt-1 leading-snug"
            style={{ fontSize: "clamp(10px,0.85vw,13px)", color: "var(--proj-ink-3)" }} // 8→10, 0.75→0.85, 11→13
          >
            {data.title}
          </p>
          <p
            className="mt-0.5"
            style={{ fontSize: "clamp(9px,0.75vw,12px)", color: "var(--proj-ink-4)", lineHeight: 1.6 }} // 7→9, 0.65→0.75, 10→12
          >
            {data.sub}
          </p>
        </div>

        {/* ══ B — Image (rows 1–2) ══ */}
        <div
          className="relative overflow-hidden"
          style={{ gridColumn: 2, gridRow: "1 / 3", background: "var(--suit-brown)" }}
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
                "linear-gradient(to bottom, var(--proj-cream) 0%, transparent 10%, transparent 90%, var(--proj-cream) 100%)",
            }}
          />
        </div>

        {/* ══ C1 — Role, Duration, Status ══ */}
        <div
          className="flex flex-col justify-between overflow-hidden"
          style={{
            background: "var(--proj-cream)",
            gridColumn: 3, gridRow: 1,
            padding: "clamp(10px,1.5vh,18px)",
          }}
        >
          {[
            { label: "Role",     value: `${data.role}` },
            { label: "Status",   value: data.status },
            { label: "Duration", value: `${data.duration}` },
            { label: "Year",     value: `${data.year}` },
          ].map(({ label, value }) => (
            <p
              key={label}
              style={{
                fontSize: "clamp(10px,0.82vw,13px)", // 8→10, 0.72→0.82, 11→13
                color: "var(--proj-ink-3)",
                lineHeight: 1.5,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                minWidth: 0,
              }}
            >
              <span style={{
                display: "inline",
                color: "var(--proj-bark-3)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                fontSize: "clamp(8px,0.7vw,11px)", // 7→8, 0.6→0.7, 9→11
                textTransform: "uppercase",
                marginRight: "0.35em",
              }}>
                {label}:
              </span>
              {value}
            </p>
          ))}
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
              fontSize: "clamp(10px,0.82vw,13px)", // 8→10, 0.72→0.82, 11→13
              color: "var(--suit-brown)",
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
            <p style={{ fontSize: "clamp(10px,0.82vw,13px)", color: "var(--suit-brown)", lineHeight: 1.82 }}> {/* 8→10 */}
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
            <div className="flex flex-wrap gap-[5px]">
              {data.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono shrink-0"
                  style={{
                    fontSize: "clamp(8px,0.75vw,11px)", // 7→8, 0.65→0.75, 10→11
                    color: "var(--suit-brown)",
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
                fontSize: "clamp(8px,0.7vw,10px)", // 7→8, 0.6→0.7, 8→10
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
            fontSize: "clamp(8px,0.7vw,11px)", // 7→8, 0.6→0.7, 9→11
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