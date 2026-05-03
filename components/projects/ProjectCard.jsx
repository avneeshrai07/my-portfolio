"use client";

import React from "react";

const LBL = "text-[10px] uppercase tracking-[0.14em] font-medium block mb-1";

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
            gridColumn: 1,
            gridRow: 1,
            padding: "clamp(10px,10.2vw,18px)",
          }}
        >
          <h2
            className="font-medium leading-none m-0"
            style={{
              fontSize: "clamp(13px, 2vw + 0.6rem, 52px)",
              letterSpacing: "-0.04em",
              color: "var(--suit-brown)",
            }}
          >
            {data.name}
          </h2>
          <p
            className="font-medium mt-1 leading-snug"
            style={{
              fontSize: "clamp(10px,0.85vw,13px)",
              color: "var(--proj-ink-3)",
            }}
          >
            {data.title}
          </p>
          <p
            className="mt-0.5"
            style={{
              fontSize: "clamp(9px,0.75vw,12px)",
              color: "var(--proj-ink-4)",
              lineHeight: 1.6,
            }}
          >
            {data.sub}
          </p>
        </div>

        {/* ══ B — Image (rows 1–2) ══ */}
        <div
          className="relative overflow-hidden"
          style={{
            gridColumn: 2,
            gridRow: "1 / 3",
            background: "var(--suit-brown)",
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_CDN_URL}${data.image}`}
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
          className="flex flex-col overflow-hidden"
          style={{
            background: "var(--proj-cream)",
            gridColumn: 3,
            gridRow: 1,
            padding: "clamp(10px,1.5vh,18px)",
          }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar flex flex-col justify-between">
            {[
              { label: "Role", value: `${data.role}` },
              { label: "Status", value: data.status },
              { label: "Duration", value: `${data.duration}` },
              { label: "Year", value: `${data.year}` },
            ].map(({ label, value }) => (
              <p
                key={label}
                style={{
                  fontSize: "clamp(10px,0.82vw,13px)",
                  color: "var(--proj-ink-3)",
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    display: "inline",
                    color: "var(--proj-bark-3)",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    fontSize: "clamp(8px,0.7vw,11px)",
                    textTransform: "uppercase",
                    marginRight: "0.35em",
                  }}
                >
                  {label}:
                </span>
                {value}
              </p>
            ))}
          </div>
        </div>

        {/* ══ A2 — Impact ══ */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            background: "var(--proj-cream)",
            gridColumn: 1,
            gridRow: 2,
            padding: "clamp(10px,1.2vw,18px)",
          }}
        >
          <span className={LBL} style={{ color: "var(--proj-bark-3)" }}>
            Impact
          </span>
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            <p
              style={{
                fontSize: "clamp(10px,0.82vw,13px)",
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
        </div>

        {/* ══ C — Overview (rows 2–3) ══ */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            background: "var(--proj-sand)",
            gridColumn: 3,
            gridRow: "2 / 4",
            padding: "clamp(10px,1.2vw,18px)",
          }}
        >
          <span className={LBL} style={{ color: "var(--proj-bark-3)" }}>
            Overview
          </span>
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            <p
              style={{
                fontSize: "clamp(10px,0.82vw,13px)",
                color: "var(--suit-brown)",
                lineHeight: 1.82,
              }}
            >
              {data.overview}
            </p>
          </div>
        </div>

        {/* ══ A3+B3 — Tech Stack (cols 1+2, row 3) ══ */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            background: "var(--proj-cream)",
            gridColumn: "1 / 3",
            gridRow: 3,
            padding: "clamp(8px,1vw,14px)",
          }}
        >
          <span className={LBL} style={{ color: "var(--proj-bark-3)" }}>
            Tech Stack
          </span>
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            <div className="flex flex-wrap gap-[5px]">
              {data.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono shrink-0"
                  style={{
                    fontSize: "clamp(8px,0.75vw,11px)",
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
                fontSize: "clamp(8px,0.7vw,10px)",
                padding: "2px 7px",
                borderRadius: "2px",
                letterSpacing: "0.06em",
                background:
                  t.type === "live"
                    ? "var(--proj-tag-live-bg)"
                    : "var(--proj-sand)",
                border: `0.5px solid ${t.type === "live" ? "var(--proj-tag-live-bd)" : "var(--proj-border-2)"}`,
                color:
                  t.type === "live"
                    ? "var(--proj-tag-live-tx)"
                    : "var(--proj-ink-3)",
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
            fontSize: "clamp(8px,0.7vw,11px)",
            color: "var(--proj-bark)",
            textDecoration: "none",
            letterSpacing: "0.1em",
          }}
        >
          {`VIEW PROJECT →`}
        </a>
      </div>
    </div>
  );
}
