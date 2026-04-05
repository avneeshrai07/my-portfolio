"use client";

import { useEffect, useRef, useState } from "react";
import data from "@/data/my_journey_data.json";

interface JourneyItem {
  year: string;
  period?: string;
  tag?: string;
  title: string;
  subtitle?: string;
  body?: string;
  highlights?: string[];
}

const ITEMS: JourneyItem[] = data.journey;

interface RowProps {
  item: JourneyItem;
  index: number;
  isLeft: boolean;
  dotRef: (el: HTMLDivElement | null) => void;
  mobileDotRef: (el: HTMLDivElement | null) => void;
}

function Row({ item, index, isLeft, dotRef, mobileDotRef }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const delay = index * 80;

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.unobserve(el); }
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const dot = (
    <div
      ref={dotRef}
      style={{
        width: 18, height: 18, borderRadius: "50%",
        border: `2px solid ${visible ? "var(--suit-brown)" : "var(--shirt-tan)"}`,
        background: "var(--hero-gradient)",
        display: "grid", placeItems: "center",
        flexShrink: 0, position: "relative", zIndex: 2,
        transition: `border-color 0.3s ${delay + 80}ms, box-shadow 0.3s ${delay + 80}ms`,
        boxShadow: visible
          ? "0 0 0 4px color-mix(in oklch, var(--suit-brown) 15%, transparent)"
          : "none",
      }}
    >
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: "var(--suit-brown)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0)",
        transition: `opacity 0.3s ${delay + 200}ms, transform 0.35s ${delay + 200}ms cubic-bezier(0.34,1.56,0.64,1)`,
      }} />
    </div>
  );

  const dateBlock = (align: "left" | "right") => (
    <div style={{
      textAlign: align, flexShrink: 0,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: `opacity 0.4s ${delay}ms, transform 0.4s ${delay}ms cubic-bezier(0.16,1,0.3,1)`,
    }}>
      {/* year — suit-brown, strong */}
      <div style={{
        fontSize: "clamp(0.72rem, 1.1vw, 0.85rem)", fontWeight: 700,
        color: "var(--suit-brown)", letterSpacing: "0.04em",
        lineHeight: 1, whiteSpace: "nowrap",
      }}>
        {item.year}
      </div>
      {item.period && (
        <div style={{
          fontSize: "clamp(0.62rem, 0.9vw, 0.72rem)",
          color: "var(--skin-tone)", marginTop: "0.2rem",
          lineHeight: 1.3, whiteSpace: "nowrap",
        }}>
          {item.period}
        </div>
      )}
    </div>
  );

  const slideX = isLeft ? "-12px" : "12px";
  const contentBlock = (align: "left" | "right") => (
    <div style={{
      flex: 1, minWidth: 0, textAlign: align,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : `translateX(${slideX})`,
      transition: `opacity 0.45s ${delay + 60}ms, transform 0.45s ${delay + 60}ms cubic-bezier(0.16,1,0.3,1)`,
    }}>
      {item.tag && (
        <span style={{
          display: "inline-block",
          fontSize: "clamp(0.58rem, 0.85vw, 0.65rem)", fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase" as const,
          color: "var(--suit-brown)", background: "var(--shirt-tan)",
          borderRadius: 9999, padding: "0.2em 0.75em", marginBottom: "0.5rem",
          opacity: 0.9,
        }}>
          {item.tag}
        </span>
      )}
      {/* title — suit-brown, most prominent */}
      <h2 style={{
        fontSize: "clamp(1rem, 2.2vw, 1.55rem)", fontWeight: 700,
        color: "var(--suit-brown)", lineHeight: 1.2, marginBottom: "0.3rem",
      }}>
        {item.title}
      </h2>
      {item.subtitle && (
        <p style={{
          fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)", fontWeight: 600,
          color: "var(--skin-tone)", lineHeight: 1.4, marginBottom: "0.45rem",
        }}>
          {item.subtitle}
        </p>
      )}
      {item.body && (
        <p style={{
          fontSize: "clamp(0.78rem, 1.15vw, 0.9rem)",
          color: "var(--skin-tone)", lineHeight: 1.8, maxWidth: "36ch",
          marginLeft: align === "right" ? "auto" : undefined,
          opacity: 0.85,
        }}>
          {item.body}
        </p>
      )}
      {!!item.highlights?.length && (
        <ul style={{
          listStyle: "none", margin: "0.7rem 0 0", padding: 0,
          display: "flex", flexDirection: "column", gap: "0.32rem",
          alignItems: align === "right" ? "flex-end" : "flex-start",
        }}>
          {item.highlights.map((h, hi) => (
            <li key={hi} style={{
              display: "flex",
              flexDirection: align === "right" ? "row-reverse" : "row",
              alignItems: "flex-start", gap: "0.4rem",
              fontSize: "clamp(0.72rem, 1.05vw, 0.83rem)",
              color: "var(--skin-tone)", lineHeight: 1.6, opacity: 0.85,
            }}>
              <span style={{
                flexShrink: 0, width: 5, height: 5, borderRadius: "50%",
                background: "var(--suit-brown)", opacity: 0.5,
                marginTop: "0.48em", display: "inline-block",
              }} />
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div ref={rowRef} style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>

      {/* ── DESKTOP ───────────────────────────────────────────── */}
      <div className="tj-desktop" style={{
        display: "grid",
        gridTemplateColumns: "1fr 18px 1fr",
        columnGap: "clamp(0.75rem, 2vw, 1.5rem)",
        alignItems: "flex-start",
      }}>
        <div style={{
          display: "flex", justifyContent: "flex-end",
          alignItems: "flex-start",
          minWidth: 0, overflow: "hidden", paddingTop: "0.1rem",
        }}>
          {isLeft ? contentBlock("right") : dateBlock("right")}
        </div>
        <div style={{ lineHeight: 0, paddingTop: "0.1rem" }}>
          {dot}
        </div>
        <div style={{
          display: "flex", justifyContent: "flex-start",
          alignItems: "flex-start",
          minWidth: 0, overflow: "hidden", paddingTop: "0.1rem",
        }}>
          {isLeft ? dateBlock("left") : contentBlock("left")}
        </div>
      </div>

      {/* ── MOBILE ────────────────────────────────────────────── */}
      <div className="tj-mobile" style={{ display: "none" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div
              ref={mobileDotRef}
              style={{
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${visible ? "var(--suit-brown)" : "var(--shirt-tan)"}`,
                background: "var(--hero-gradient)", display: "grid", placeItems: "center",
                transition: `border-color 0.3s ${delay + 80}ms`,
                position: "relative", zIndex: 2,
              }}
            >
              <div style={{
                width: 7, height: 7, borderRadius: "50%", background: "var(--suit-brown)",
                opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0)",
                transition: `opacity 0.3s ${delay + 200}ms, transform 0.35s ${delay + 200}ms cubic-bezier(0.34,1.56,0.64,1)`,
              }} />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0, paddingBottom: "0.65rem" }}>
            <div style={{ marginBottom: "0.45rem" }}>
              {/* year — suit-brown */}
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--suit-brown)", letterSpacing: "0.04em", lineHeight: 1 }}>
                {item.year}
              </div>
              {item.period && (
                <div style={{ fontSize: "0.68rem", color: "var(--skin-tone)", marginTop: "0.15rem", opacity: 0.85 }}>
                  {item.period}
                </div>
              )}
            </div>
            {item.tag && (
              <span style={{
                display: "inline-block", fontSize: "0.62rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase" as const,
                color: "var(--suit-brown)", background: "var(--shirt-tan)",
                borderRadius: 9999, padding: "0.2em 0.75em", marginBottom: "0.5rem",
                opacity: 0.9,
              }}>
                {item.tag}
              </span>
            )}
            {/* title — suit-brown */}
            <h2 style={{
              fontSize: "clamp(1rem, 4.5vw, 1.25rem)", fontWeight: 700,
              color: "var(--suit-brown)", lineHeight: 1.2, marginBottom: "0.3rem",
            }}>
              {item.title}
            </h2>
            {item.subtitle && (
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--skin-tone)", lineHeight: 1.4, marginBottom: "0.4rem" }}>
                {item.subtitle}
              </p>
            )}
            {item.body && (
              <p style={{ fontSize: "0.82rem", color: "var(--skin-tone)", lineHeight: 1.8, maxWidth: "44ch", opacity: 0.85 }}>
                {item.body}
              </p>
            )}
            {!!item.highlights?.length && (
              <ul style={{ listStyle: "none", margin: "0.65rem 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {item.highlights.map((h, hi) => (
                  <li key={hi} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", fontSize: "0.78rem", color: "var(--skin-tone)", lineHeight: 1.6, opacity: 0.85 }}>
                    <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: "50%", background: "var(--suit-brown)", opacity: 0.5, marginTop: "0.48em", display: "inline-block" }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────
export default function MyJourney() {
  const dotRefs       = useRef<(HTMLDivElement | null)[]>(ITEMS.map(() => null));
  const mobileDotRefs = useRef<(HTMLDivElement | null)[]>(ITEMS.map(() => null));
  const wrapRef       = useRef<HTMLDivElement>(null);

  const svgRef   = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGLineElement>(null);
  const fillRef  = useRef<SVGLineElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);

  const mSvgRef   = useRef<SVGSVGElement>(null);
  const mTrackRef = useRef<SVGLineElement>(null);
  const mFillRef  = useRef<SVGLineElement>(null);
  const mPulseRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    function draw() {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wRect = wrap.getBoundingClientRect();

      const scrollProgress = (len: number, y1: number) =>
        Math.min(Math.max(
          (window.scrollY + window.innerHeight * 0.62
            - (wRect.top + window.scrollY) - y1) / len,
          0
        ), 1);

      // ── DESKTOP ──────────────────────────────────────────────
      const svg   = svgRef.current;
      const track = trackRef.current;
      const fill  = fillRef.current;
      const pulse = pulseRef.current;
      const dots  = dotRefs.current.filter((d): d is HTMLDivElement => d !== null);

      if (svg && track && fill && dots.length >= 2) {
        const W = wrap.offsetWidth;
        const H = wrap.offsetHeight;
        const first = dots[0].getBoundingClientRect();
        const last  = dots[dots.length - 1].getBoundingClientRect();
        const cx = first.left + first.width  / 2 - wRect.left;
        const y1 = first.top  + first.height / 2 - wRect.top;
        const y2 = last.top   + last.height  / 2 - wRect.top;

        svg.setAttribute("width",   String(W));
        svg.setAttribute("height",  String(H));
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

        track.setAttribute("x1", String(cx)); track.setAttribute("y1", String(y1));
        track.setAttribute("x2", String(cx)); track.setAttribute("y2", String(y2));

        const len = y2 - y1;
        if (len > 0) {
          const p = scrollProgress(len, y1);

          fill.setAttribute("x1", String(cx)); fill.setAttribute("y1", String(y1));
          fill.setAttribute("x2", String(cx)); fill.setAttribute("y2", String(y2));
          fill.style.strokeDasharray  = String(len);
          fill.style.strokeDashoffset = String(len * (1 - p));

          if (pulse) {
            const py = y1 + len * p;
            pulse.setAttribute("cx", String(cx));
            pulse.setAttribute("cy", String(py));
            pulse.style.opacity = p > 0 && p < 1 ? "1" : "0";

            const ring = document.getElementById("tj-pulse-ring-desktop");
            if (ring) {
              ring.setAttribute("cx", String(cx));
              ring.setAttribute("cy", String(py));
              ring.style.opacity = p > 0 && p < 1 ? "1" : "0";
            }
          }
        }
      }

      // ── MOBILE ───────────────────────────────────────────────
      const mSvg   = mSvgRef.current;
      const mTrack = mTrackRef.current;
      const mFill  = mFillRef.current;
      const mPulse = mPulseRef.current;
      const mDots  = mobileDotRefs.current.filter((d): d is HTMLDivElement => d !== null);

      if (mSvg && mTrack && mFill && mDots.length >= 2) {
        if (mDots[0].offsetParent === null) return;

        const W = wrap.offsetWidth;
        const H = wrap.offsetHeight;
        const first = mDots[0].getBoundingClientRect();
        const last  = mDots[mDots.length - 1].getBoundingClientRect();

        if (first.width === 0) return;

        const cx = first.left + first.width  / 2 - wRect.left;
        const y1 = first.top  + first.height / 2 - wRect.top;
        const y2 = last.top   + last.height  / 2 - wRect.top;

        mSvg.setAttribute("width",   String(W));
        mSvg.setAttribute("height",  String(H));
        mSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);

        mTrack.setAttribute("x1", String(cx)); mTrack.setAttribute("y1", String(y1));
        mTrack.setAttribute("x2", String(cx)); mTrack.setAttribute("y2", String(y2));

        const len = y2 - y1;
        if (len > 0) {
          const p = scrollProgress(len, y1);

          mFill.setAttribute("x1", String(cx)); mFill.setAttribute("y1", String(y1));
          mFill.setAttribute("x2", String(cx)); mFill.setAttribute("y2", String(y2));
          mFill.style.strokeDasharray  = String(len);
          mFill.style.strokeDashoffset = String(len * (1 - p));

          if (mPulse) {
            const py = y1 + len * p;
            mPulse.setAttribute("cx", String(cx));
            mPulse.setAttribute("cy", String(py));
            mPulse.style.opacity = p > 0 && p < 1 ? "1" : "0";

            const mRing = document.getElementById("tj-pulse-ring-mobile");
            if (mRing) {
              mRing.setAttribute("cx", String(cx));
              mRing.setAttribute("cy", String(py));
              mRing.style.opacity = p > 0 && p < 1 ? "1" : "0";
            }
          }
        }
      }
    }

    let r1: number, r2: number;
    r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(draw); });
    window.addEventListener("scroll", draw, { passive: true });
    window.addEventListener("resize", draw);
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      window.removeEventListener("scroll", draw);
      window.removeEventListener("resize", draw);
    };
  }, []);

  return (
    <>
      <style>{`
        .tj-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding-inline: clamp(1rem, 5vw, 2rem);
          font-family: Satoshi, Inter, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        @keyframes tj-ripple {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(3.2); opacity: 0;   }
        }
        .tj-pulse-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: tj-ripple 1.5s ease-out infinite;
        }
        @media (max-width: 580px) {
          .tj-desktop { display: none  !important; }
          .tj-mobile  { display: block !important; }
        }
        @media (min-width: 581px) {
          .tj-desktop { display: grid  !important; }
          .tj-mobile  { display: none  !important; }
        }
      `}</style>

      {/* ── outer wrapper gets the hero grain background ── */}
      <div className="bg-hero-gradient">

        {/* Header */}
        <div className="tj-wrap" style={{
          paddingTop: "clamp(3rem, 8vw, 5.5rem)",
          paddingBottom: "clamp(1.5rem, 4vw, 2.5rem)",
          position: "relative", zIndex: 1,
        }}>
          <p style={{
            fontSize: "clamp(0.6rem, 0.9vw, 0.7rem)", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--suit-brown)", marginBottom: "0.6rem",
          }}>
            My Journey
          </p>
        </div>

        {/* Timeline */}
        <div className="tj-wrap" style={{  position: "relative", zIndex: 1 }}>
          <div ref={wrapRef} style={{ position: "relative" }}>

            {/* ── DESKTOP SVG ─────────────────────────────────── */}
            <svg
              ref={svgRef}
              aria-hidden="true"
              width="0" height="0"
              className="tj-desktop"
              style={{
                position: "absolute", top: 0, left: 0,
                pointerEvents: "none", zIndex: 0, overflow: "visible",
                display: "block",
              }}
            >
              <defs>
                {/* track uses shirt-tan, fill uses suit-brown → skin-tone gradient */}
                <linearGradient id="tj-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--suit-brown)" />
                  <stop offset="60%"  stopColor="var(--skin-tone)" />
                  <stop offset="100%" stopColor="var(--shirt-tan)" />
                </linearGradient>
              </defs>

              {/* Track — unfilled, shirt-tan */}
              <line
                ref={trackRef}
                strokeWidth="3"
                stroke="var(--shirt-tan)"
                opacity="0.5"
              />

              {/* Colored fill — suit-brown → skin-tone → shirt-tan */}
              <line
                ref={fillRef}
                strokeWidth="3.5"
                stroke="url(#tj-grad)"
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.08s linear" }}
              />

              {/* Solid dot at the leading tip */}
              <circle
                ref={pulseRef}
                r="5"
                fill="var(--skin-tone)"
                opacity="0"
                style={{ transition: "opacity 0.2s" }}
              />

              {/* Ripple ring */}
              <circle
                id="tj-pulse-ring-desktop"
                className="tj-pulse-ring"
                r="5"
                fill="none"
                stroke="var(--skin-tone)"
                strokeWidth="1.5"
                opacity="0"
              />
            </svg>

            {/* ── MOBILE SVG ──────────────────────────────────── */}
            <svg
              ref={mSvgRef}
              aria-hidden="true"
              width="0" height="0"
              className="tj-mobile"
              style={{
                position: "absolute", top: 0, left: 0,
                pointerEvents: "none", zIndex: 0, overflow: "visible",
                display: "none",
              }}
            >
              <defs>
                <linearGradient id="tj-grad-m" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--suit-brown)" />
                  <stop offset="60%"  stopColor="var(--skin-tone)" />
                  <stop offset="100%" stopColor="var(--shirt-tan)" />
                </linearGradient>
              </defs>

              <line
                ref={mTrackRef}
                strokeWidth="3"
                stroke="var(--shirt-tan)"
                opacity="0.5"
              />

              <line
                ref={mFillRef}
                strokeWidth="3.5"
                stroke="url(#tj-grad-m)"
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.08s linear" }}
              />

              <circle
                ref={mPulseRef}
                r="5"
                fill="var(--skin-tone)"
                opacity="0"
                style={{ transition: "opacity 0.2s" }}
              />

              <circle
                id="tj-pulse-ring-mobile"
                className="tj-pulse-ring"
                r="5"
                fill="none"
                stroke="var(--skin-tone)"
                strokeWidth="1.5"
                opacity="0"
              />
            </svg>

            {ITEMS.map((item, i) => (
              <Row
                key={i}
                item={item}
                index={i}
                isLeft={i % 2 === 0}
                dotRef={(el) => { dotRefs.current[i] = el; }}
                mobileDotRef={(el) => { mobileDotRefs.current[i] = el; }}
              />
            ))}

          </div>
        </div>

      </div>{/* end bg-hero-gradient */}
    </>
  );
}