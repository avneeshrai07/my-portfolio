"use client";

import { useState, useRef, MouseEvent, TouchEvent, useEffect, useCallback } from "react";

type PreparedText = unknown;
interface LayoutLine { text: string; width: number }

const SERVICES = ["Brand Design", "Product Design", "UI/UX Design", "Design Consultancy"];
const TAGLINE  = "FULL-STACK DEVELOPER & SAAS BUILDER";
const NAME     = "Avneesh";
const BIO      = "Building high-performance APIs, progressive web apps, and scalable systems that ship fast and last long.";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering,    setIsHovering]    = useState(false);
  const [isMobile,      setIsMobile]      = useState(false);
  const containerRef  = useRef<HTMLDivElement>(null);
  const circleRef     = useRef<HTMLDivElement>(null);
  const photoCentreRef= useRef<HTMLDivElement>(null);

  const [bioLines, setBioLines] = useState<string[]>([]);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const reflow = useCallback(async () => {
    if (typeof window === "undefined" || isMobile) return;
    if (!containerRef.current || !photoCentreRef.current || !bioRef.current) return;

    try {
      const { prepareWithSegments, layoutNextLine } = await import("@chenglou/pretext");

      const heroRect  = containerRef.current.getBoundingClientRect();
      const photoRect = photoCentreRef.current.getBoundingClientRect();
      const bioRect   = bioRef.current.getBoundingClientRect();

      const obsLeft = photoRect.left   - heroRect.left;
      const obsTop  = photoRect.top    - heroRect.top;
      const obsBot  = photoRect.bottom - heroRect.top;

      const bioX = bioRect.left - heroRect.left;
      const bioY = bioRect.top  - heroRect.top;
      const bioW = bioRect.width;

      const FONT   = "600 17px system-ui, sans-serif";
      const LINE_H = 30;

      const handle: PreparedText = prepareWithSegments(BIO, FONT);
      const lines: string[] = [];
      let cursor: unknown = 0;

      for (let i = 0; i < 20; i++) {
        const lineTop = bioY + i * LINE_H;
        const lineMid = lineTop + LINE_H / 2;

        const overlaps = lineMid > obsTop && lineMid < obsBot;
        const lineW = overlaps
          ? Math.max(60, obsLeft - bioX - 16)
          : bioW;

        const result = (layoutNextLine as unknown as (
          p: unknown, c: unknown, w: number
        ) => [LayoutLine, unknown] | null)(handle, cursor, lineW);

        if (!result) break;
        const [line, nextCursor] = result;
        lines.push(line.text);
        cursor = nextCursor;
      }

      setBioLines(lines);
    } catch {
      setBioLines([]);
    }
  }, [isMobile]);

  useEffect(() => {
    const t = setTimeout(reflow, 100);
    window.addEventListener("resize", reflow);
    return () => { clearTimeout(t); window.removeEventListener("resize", reflow); };
  }, [reflow]);

  const CIRCLE = isMobile ? 180 : 350;

  const updateCircle = (x: number, y: number) => {
    if (!circleRef.current) return;
    circleRef.current.style.transform = `translate3d(${x - CIRCLE / 2}px, ${y - CIRCLE / 2}px, 0)`;
    setMousePosition({ x, y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    updateCircle(e.clientX - r.left, e.clientY - r.top);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const t = e.touches[0];
    const r = containerRef.current.getBoundingClientRect();
    updateCircle(t.clientX - r.left, t.clientY - r.top);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#EEEADF]"
      style={{ height: "100svh", minHeight: 600, touchAction: "pan-y", cursor: "crosshair" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={(e) => { setIsHovering(true); handleTouchMove(e as TouchEvent<HTMLDivElement>); }}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsHovering(false)}
    >

      {/* ── Layer 0: Professional photo — full background ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/my_professional.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── Layer 1: Batman reveal circle ── */}
      <div
        ref={circleRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: CIRCLE,
          height: CIRCLE,
          borderRadius: "50%",
          overflow: "hidden",
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.2s ease",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
          zIndex: 2,
          contain: "layout paint",
        }}
      >
        <div
          style={{
            width: "100vw",
            height: "100svh",
            backgroundImage: "url(/batman.png)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            transform: `translate3d(${-mousePosition.x + CIRCLE / 2 - 8}px, ${-mousePosition.y + CIRCLE / 2}px, 0)`,
            willChange: "transform",
          }}
        />
      </div>

      {/* Mobile-only gradient */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-[#1a1207]/90 via-[#1a1207]/25 to-transparent z-3" />

      {/* ════════════════ DESKTOP — 3-col grid ════════════════ */}
      <div className="hidden lg:grid absolute inset-0 z-10" style={{ gridTemplateColumns: "38% 1fr 22%" }}>

        {/* ── Left column ── */}
        <div
          className="flex flex-col justify-between py-12 pl-12 pr-6"
          style={{ isolation: "isolate" }}
        >
          {/* Tagline */}
          <p
            className="text-[11px] font-bold tracking-[0.25em] uppercase text-hero-suit/60"
            style={{ mixBlendMode: "difference", color: "var(--hero-suit)" }}
          >
            {TAGLINE}
          </p>

          {/* Name + Bio block */}
          <div>
            <h1
              className="font-black leading-none mb-6 text-hero-skin"
              style={{ fontSize: "clamp(4rem, 8vw, 8rem)", mixBlendMode: "difference" }}
            >
              {NAME}
            </h1>

            <div
              ref={bioRef}
              className="font-semibold text-hero-suit/90 leading-[1.8]"
              style={{ fontSize: 17, mixBlendMode: "difference" }}
            >
              {bioLines.length > 0 ? (
                bioLines.map((line, i) => <div key={i}>{line}</div>)
              ) : (
                <p className="max-w-xs">{BIO}</p>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-6">
            <button
              className="pointer-events-auto px-8 py-4 bg-hero-suit/20 text-hero-suit rounded-full hover:bg-hero-suit/30 transition-all duration-300 border-2 border-hero-suit/30 font-semibold active:scale-95 text-sm"
            >
              View My Work
            </button>
            <div className="h-px flex-1 bg-hero-suit/20" />
          </div>
        </div>

        {/* ── Centre: pill portrait — Pretext reflow obstacle ── */}
        <div
          ref={photoCentreRef}
          className="relative flex items-end justify-center"
        >
        </div>

        {/* ── Right column: services ── */}
        <div className="flex flex-col justify-center py-12 pr-12 pl-4">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-hero-suit/40 mb-8">
            Services
          </p>
          <ul className="space-y-4">
            {SERVICES.map((s, i) => (
              <li
                key={s}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  i === 1
                    ? "text-hero-suit"
                    : "text-hero-suit/35 hover:text-hero-suit/60"
                }`}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ════════════════ MOBILE — bottom-anchored panel ════════════════ */}
      <div className="lg:hidden absolute inset-x-0 bottom-0 z-10">
        <div
          className="px-6 pt-8 pb-10 space-y-4"
          style={{ background: "linear-gradient(to top, rgba(26,18,7,0.92) 80%, transparent)" }}
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/50">
            {TAGLINE}
          </p>

          <h1
            className="font-black text-[#d4a882] leading-none"
            style={{ fontSize: "clamp(3.2rem, 16vw, 5rem)" }}
          >
            {NAME}
          </h1>

          <p className="text-[15px] text-white/80 leading-relaxed max-w-xs">
            {BIO}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {SERVICES.map((s, i) => (
              <span
                key={s}
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                  i === 1
                    ? "bg-white/15 border-white/40 text-white"
                    : "border-white/15 text-white/40"
                }`}
              >
                {s}
              </span>
            ))}
          </div>

          <button className="pointer-events-auto mt-2 flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#d4a882]/20 border-2 border-[#d4a882]/40 text-[#d4a882] font-bold text-sm tracking-wide active:scale-95 transition-transform">
            View My Work →
          </button>
        </div>
      </div>

    </section>
  );
}
