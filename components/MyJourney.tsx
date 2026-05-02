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
  isLast: boolean;
  dotRef: (el: HTMLDivElement | null) => void;
  mobileDotRef: (el: HTMLDivElement | null) => void;
}

function Row({ item, index, isLeft, isLast, dotRef, mobileDotRef }: RowProps) {
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
      className={`
        bg-[var(--hero-gradient)] grid place-items-center
        rounded-full shrink-0 relative z-[2]
        w-[18px] h-[18px]
        border-2 transition-all
        ${visible
          ? "border-[var(--suit-brown)] shadow-[0_0_0_4px_color-mix(in_oklch,var(--suit-brown)_15%,transparent)]"
          : "border-[var(--shirt-tan)] shadow-none"
        }
      `}
      style={{ transitionDelay: `${delay + 80}ms` }}
    >
      <div
        className="w-[7px] h-[7px] rounded-full bg-[var(--suit-brown)] transition-all"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0)",
          transitionDuration: "300ms, 350ms",
          transitionProperty: "opacity, transform",
          transitionDelay: `${delay + 200}ms`,
          transitionTimingFunction: "ease, cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    </div>
  );

  const dateBlock = (align: "left" | "right") => (
    <div
      className={`shrink-0 ${align === "right" ? "text-right" : "text-left"} transition-all`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transitionDuration: "400ms",
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="text-[clamp(0.72rem,1.1vw,0.85rem)] font-bold text-[var(--suit-brown)] tracking-[0.04em] leading-none whitespace-nowrap">
        {item.year}
      </div>
      {item.period && (
        <div className="text-[clamp(0.62rem,0.9vw,0.72rem)] text-[var(--skin-tone)] mt-[0.2rem] leading-snug whitespace-nowrap">
          {item.period}
        </div>
      )}
    </div>
  );

  const slideX = isLeft ? "-12px" : "12px";
  const contentBlock = (align: "left" | "right") => (
    <div
      className={`flex-1 min-w-0 ${align === "right" ? "text-right" : "text-left"} transition-all`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${slideX})`,
        transitionDuration: "450ms",
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${delay + 60}ms`,
      }}
    >
      {item.tag && (
        <span className="inline-block text-[clamp(0.58rem,0.85vw,0.65rem)] font-bold tracking-[0.1em] uppercase text-[var(--suit-brown)] bg-[var(--shirt-tan)] rounded-full px-[0.75em] py-[0.2em] mb-2 opacity-90">
          {item.tag}
        </span>
      )}
      <h2 className="text-[clamp(1rem,2.2vw,1.55rem)] font-bold text-[var(--suit-brown)] leading-tight mb-1">
        {item.title}
      </h2>
      {item.subtitle && (
        <p className="text-[clamp(0.75rem,1.1vw,0.875rem)] font-semibold text-[var(--skin-tone)] leading-snug mb-[0.45rem]">
          {item.subtitle}
        </p>
      )}
      {item.body && (
        <p
          className="text-[clamp(0.78rem,1.15vw,0.9rem)] text-[var(--skin-tone)] leading-relaxed opacity-85 max-w-[36ch]"
          style={{ marginLeft: align === "right" ? "auto" : undefined }}
        >
          {item.body}
        </p>
      )}
      {!!item.highlights?.length && (
        <ul className={`list-none mt-[0.7rem] p-0 flex flex-col gap-[0.32rem] ${align === "right" ? "items-end" : "items-start"}`}>
          {item.highlights.map((h, hi) => (
            <li
              key={hi}
              className={`flex gap-[0.4rem] text-[clamp(0.72rem,1.05vw,0.83rem)] text-[var(--skin-tone)] leading-relaxed opacity-85 items-start ${align === "right" ? "flex-row-reverse" : "flex-row"}`}
            >
              <span className="shrink-0 w-[5px] h-[5px] rounded-full bg-[var(--suit-brown)] opacity-50 mt-[0.48em] inline-block" />
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div
      ref={rowRef}
      className={isLast ? "mb-0" : "mb-[clamp(2.5rem,5vw,4rem)]"}
    >

      {/* ── DESKTOP ───────────────────────────────────────────── */}
      <div
        className="tj-desktop grid items-start"
        style={{
          gridTemplateColumns: "1fr 18px 1fr",
          columnGap: "clamp(0.75rem, 2vw, 1.5rem)",
        }}
      >
        <div className="flex justify-end items-start min-w-0 overflow-hidden pt-[0.1rem]">
          {isLeft ? contentBlock("right") : dateBlock("right")}
        </div>
        <div className="leading-none pt-[0.1rem]">
          {dot}
        </div>
        <div className="flex justify-start items-start min-w-0 overflow-hidden pt-[0.1rem]">
          {isLeft ? dateBlock("left") : contentBlock("left")}
        </div>
      </div>

      {/* ── MOBILE ────────────────────────────────────────────── */}
      <div className="tj-mobile hidden">
        <div className="flex items-start gap-[0.6rem]">
          <div className="flex flex-col items-center shrink-0">
            <div
              ref={mobileDotRef}
              className={`
                w-[18px] h-[18px] rounded-full shrink-0
                bg-[var(--hero-gradient)] grid place-items-center
                relative z-[2] border-2 transition-colors
                ${visible ? "border-[var(--suit-brown)]" : "border-[var(--shirt-tan)]"}
              `}
              style={{ transitionDelay: `${delay + 80}ms` }}
            >
              <div
                className="w-[7px] h-[7px] rounded-full bg-[var(--suit-brown)] transition-all"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "scale(1)" : "scale(0)",
                  transitionDuration: "300ms, 350ms",
                  transitionProperty: "opacity, transform",
                  transitionDelay: `${delay + 200}ms`,
                  transitionTimingFunction: "ease, cubic-bezier(0.34,1.56,0.64,1)",
                }}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 pb-[0.65rem]">
            <div className="mb-[0.45rem]">
              <div className="text-[0.8rem] font-bold text-[var(--suit-brown)] tracking-[0.04em] leading-none">
                {item.year}
              </div>
              {item.period && (
                <div className="text-[0.68rem] text-[var(--skin-tone)] mt-[0.15rem] opacity-85">
                  {item.period}
                </div>
              )}
            </div>

            {item.tag && (
              <span className="inline-block text-[0.62rem] font-bold tracking-[0.1em] uppercase text-[var(--suit-brown)] bg-[var(--shirt-tan)] rounded-full px-[0.75em] py-[0.2em] mb-2 opacity-90">
                {item.tag}
              </span>
            )}

            <h2 className="text-[clamp(1rem,4.5vw,1.25rem)] font-bold text-[var(--suit-brown)] leading-tight mb-1">
              {item.title}
            </h2>

            {item.subtitle && (
              <p className="text-[0.82rem] font-semibold text-[var(--skin-tone)] leading-snug mb-[0.4rem]">
                {item.subtitle}
              </p>
            )}

            {item.body && (
              <p className="text-[0.82rem] text-[var(--skin-tone)] leading-relaxed max-w-[44ch] opacity-85">
                {item.body}
              </p>
            )}

            {!!item.highlights?.length && (
              <ul className="list-none mt-[0.65rem] p-0 flex flex-col gap-[0.3rem]">
                {item.highlights.map((h, hi) => (
                  <li key={hi} className="flex items-start gap-[0.4rem] text-[0.78rem] text-[var(--skin-tone)] leading-relaxed opacity-85">
                    <span className="shrink-0 w-[5px] h-[5px] rounded-full bg-[var(--suit-brown)] opacity-50 mt-[0.48em] inline-block" />
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

      <div className="bg-hero-gradient pb-8">

        {/* Header */}
        <div className="tj-wrap pt-[clamp(3rem,8vw,5.5rem)] pb-[clamp(1.5rem,4vw,2.5rem)] relative z-[1]">
          <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-light tracking-tight text-[var(--suit-brown)] text-center">
            My Story So Far
          </h1>
        <div className="w-[50vw] h-px mt-4 mx-auto mb-6" style={{ background: "var(--suit-brown)" }} />
        </div>

        {/* Timeline */}
        <div className="tj-wrap pb-4 relative z-[1]">
          <div ref={wrapRef} className="relative">

            {/* ── DESKTOP SVG ─────────────────────────────────── */}
            <svg
              ref={svgRef}
              aria-hidden="true"
              width="0" height="0"
              className="tj-desktop absolute top-0 left-0 pointer-events-none z-0 overflow-visible block"
            >
              <defs>
                <linearGradient id="tj-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--suit-brown)" />
                  <stop offset="60%"  stopColor="var(--skin-tone)" />
                  <stop offset="100%" stopColor="var(--shirt-tan)" />
                </linearGradient>
              </defs>
              <line ref={trackRef} strokeWidth="3" stroke="var(--shirt-tan)" opacity="0.5" />
              <line
                ref={fillRef}
                strokeWidth="3.5"
                stroke="url(#tj-grad)"
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.08s linear" }}
              />
              <circle
                ref={pulseRef}
                r="5"
                fill="var(--skin-tone)"
                opacity="0"
                style={{ transition: "opacity 0.2s" }}
              />
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
              className="tj-mobile absolute top-0 left-0 pointer-events-none z-0 overflow-visible"
              style={{ display: "none" }}
            >
              <defs>
                <linearGradient id="tj-grad-m" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--suit-brown)" />
                  <stop offset="60%"  stopColor="var(--skin-tone)" />
                  <stop offset="100%" stopColor="var(--shirt-tan)" />
                </linearGradient>
              </defs>
              <line ref={mTrackRef} strokeWidth="3" stroke="var(--shirt-tan)" opacity="0.5" />
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
                isLast={i === ITEMS.length - 1}
                dotRef={(el) => { dotRefs.current[i] = el; }}
                mobileDotRef={(el) => { mobileDotRefs.current[i] = el; }}
              />
            ))}

          </div>
        </div>

      </div>
    </>
  );
}