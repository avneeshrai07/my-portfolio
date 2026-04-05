"use client";

import { useState, useRef, MouseEvent, TouchEvent, useEffect, useCallback } from "react";

// ─── Pretext types ────────────────────────────────────────────────────────────
type PreparedText = unknown;
interface LayoutLine { text: string; width: number; cursor: number }

// ─── Constants ────────────────────────────────────────────────────────────────
const SERVICES = ["Brand Design", "Product Design", "UI/UX Design", "Design Consultancy"];
const TAGLINE  = "FULL-STACK DEVELOPER & SAAS BUILDER";
const NAME     = "Avneesh";
const BIO      = "Building high-performance APIs, progressive web apps, and scalable systems that ship fast and last long.";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering,    setIsHovering]    = useState(false);
  const [isMobileDevice,setIsMobileDevice]= useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef    = useRef<HTMLDivElement>(null);

  // ── Pretext: reflow bio around the batman circle ──────────────────────────
  const [bioLines, setBioLines] = useState<string[]>([]);
  const bioRef = useRef<HTMLParagraphElement>(null);

  const batmanOffset = {
    desktop: { x: -8, y: 0 },
    mobile:  { x: 0,  y: 0 },
  };

  useEffect(() => {
    const checkMobile = () => setIsMobileDevice(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getCircleSize  = () => (isMobileDevice ? 180 : 350);
  const getBatmanOffset= () => (isMobileDevice ? batmanOffset.mobile : batmanOffset.desktop);

  // ── Reflow bio text around the batman reveal circle ───────────────────────
  //
  // The batman circle is centred on mousePosition. When hovering, it overlaps
  // the bio paragraph. We use Pretext layoutNextLine() to carve the circle
  // out of each line's available width so the text wraps around it cleanly.
  //
  const reflow = useCallback(async () => {
    if (typeof window === "undefined" || isMobileDevice) return;
    if (!containerRef.current || !bioRef.current) return;

    try {
      const { prepareWithSegments, layoutNextLine } = await import("@chenglou/pretext");

      const heroRect = containerRef.current.getBoundingClientRect();
      const bioRect  = bioRef.current.getBoundingClientRect();

      const bioX = bioRect.left  - heroRect.left;
      const bioY = bioRect.top   - heroRect.top;
      const bioW = bioRect.width;

      // Batman circle bounds in hero-relative coords
      const circleR = getCircleSize() / 2;
      const cx      = mousePosition.x;
      const cy      = mousePosition.y;

      const FONT   = "600 18px system-ui";
      const LINE_H = 32;

      const handle: PreparedText = prepareWithSegments(BIO, FONT);
      const lines: string[] = [];
      let cursor = 0;

      for (let i = 0; i < 20; i++) {
        const lineY      = bioY + i * LINE_H;
        const lineMidY   = lineY + LINE_H / 2;

        // Vertical distance from line midpoint to circle centre
        const dy = lineMidY - cy;

        let lineWidth = bioW;

        if (Math.abs(dy) < circleR) {
          // Chord width of circle at this y
          const chordHalf = Math.sqrt(circleR * circleR - dy * dy);
          const circleLeft  = cx - chordHalf - heroRect.left;
          const circleRight = cx + chordHalf - heroRect.left;

          // Does the circle intrude into the bio column?
          if (circleRight > bioX && circleLeft < bioX + bioW) {
            // Clip from whichever side the circle enters
            if (circleLeft <= bioX) {
              // Circle enters from the left — push text right
              lineWidth = Math.max(40, bioX + bioW - circleRight - 8);
            } else {
              // Circle enters from the right — shrink line
              lineWidth = Math.max(40, circleLeft - bioX - 8);
            }
          }
        }

        const line = (layoutNextLine as (
          p: PreparedText, c: number, w: number
        ) => LayoutLine | null)(handle, cursor, lineWidth);

        if (!line) break;
        lines.push(line.text);
        cursor = line.cursor;
        if (cursor >= BIO.length) break;
      }

      setBioLines(lines);
    } catch {
      // Pretext not installed — fall back to plain text
      setBioLines([]);
    }
  }, [isMobileDevice, mousePosition]);

  // Re-run reflow whenever the mouse moves (circle moves = obstacle moves)
  useEffect(() => {
    reflow();
  }, [reflow]);

  useEffect(() => {
    window.addEventListener("resize", reflow);
    return () => window.removeEventListener("resize", reflow);
  }, [reflow]);

  // ── Batman reveal circle position ────────────────────────────────────────
  const updateCirclePosition = (x: number, y: number) => {
    if (!containerRef.current || !circleRef.current) return;
    const circleSize = getCircleSize();
    const halfCircle = circleSize / 2;
    circleRef.current.style.transform = `translate3d(${x - halfCircle}px, ${y - halfCircle}px, 0)`;
    setMousePosition({ x, y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    updateCirclePosition(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect  = containerRef.current.getBoundingClientRect();
    updateCirclePosition(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsHovering(true);
    handleTouchMove(e);
  };

  const circleSize    = getCircleSize();
  const halfCircle    = circleSize / 2;
  const currentOffset = getBatmanOffset();

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden cursor-pointer bg-[#EEEADF]"
      style={{ height: "100svh", minHeight: 600, touchAction: "pan-y" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setBioLines([]); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsHovering(false)}
    >

      {/* ── Professional Photo — Full Background ── */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url(/my_professional.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          willChange: "auto",
          contain: "paint",
        }}
      />

      {/* Mobile-only gradient */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#1a1207]/90 via-[#1a1207]/25 to-transparent" />

      {/* ── Batman Reveal Circle ── */}
      <div
        ref={circleRef}
        className="absolute top-0 left-0 pointer-events-none z-20"
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          borderRadius: "50%",
          overflow: "hidden",
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.2s ease",
          willChange: "transform, opacity",
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
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
            backgroundRepeat: "no-repeat",
            transform: `translate3d(${-mousePosition.x + halfCircle + currentOffset.x}px, ${
              -mousePosition.y + halfCircle + currentOffset.y
            }px, 0)`,
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            contain: "paint",
          }}
        />
      </div>

      {/* ════════════════ DESKTOP — doc5 layout + Pretext reflow ════════════════ */}
      <div
        className="hidden md:flex absolute inset-0 items-center pointer-events-none z-10"
        style={{ contain: "layout style" }}
      >
        <div className="container mx-auto px-8 md:px-16 max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm md:text-base text-hero-suit/80 mb-4 tracking-widest uppercase font-semibold">
              {TAGLINE}
            </p>
            <h1 className="text-6xl text-hero-skin md:text-8xl font-bold mb-6 leading-tight">
              {NAME}
            </h1>

            {/*
              Bio — Pretext reflows lines around the batman circle while hovering.
              When not hovering (bioLines is empty) renders as a normal paragraph.
            */}
            {bioLines.length > 0 ? (
              <p
                ref={bioRef}
                className="text-lg md:text-xl text-hero-suit/90 mb-8 max-w-xl"
                style={{ lineHeight: "2rem" }}
              >
                {bioLines.map((line, i) => (
                  <span key={i} style={{ display: "block" }}>{line}</span>
                ))}
              </p>
            ) : (
              <p
                ref={bioRef}
                className="text-lg md:text-xl text-hero-suit/90 mb-8 max-w-xl"
              >
                {BIO}
              </p>
            )}

            <button className="pointer-events-auto px-8 py-4 bg-hero-suit/20 text-hero-suit rounded-full hover:bg-hero-suit/30 transition-all duration-300 border-2 border-hero-suit/30 font-semibold active:scale-95">
              View My Work
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════ MOBILE — doc6 layout ════════════════ */}
      <div className="md:hidden absolute inset-x-0 bottom-0 z-10">
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

          {/* Services pills */}
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