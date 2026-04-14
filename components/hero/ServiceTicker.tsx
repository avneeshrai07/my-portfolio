"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICES } from "./constants";

const ITEM_HEIGHT = 54;
const INTERVAL    = 2000;
const DURATION    = 550;

export default function ServiceTicker() {
  const trackRef    = useRef<HTMLDivElement>(null);
  const itemsRef    = useRef<HTMLDivElement[]>([]);
  const [isWhite, setIsWhite] = useState(false);
  const wrapperRef  = useRef<HTMLDivElement>(null);

  // Expose overlap setter for LiquidReveal
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    (el as any).__setBlobOverlap = (v: boolean) => setIsWhite(v);
    return () => { delete (el as any).__setBlobOverlap; };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // We render 3 copies of the list stacked: [copy0][copy1][copy2]
    // Start showing copy1 (offset = n * ITEM_HEIGHT)
    // When we scroll into copy2, silently jump back to copy1 (same visual position)
    // When we scroll into copy0, silently jump forward to copy1
    // This gives a truly infinite loop with zero snapping

    const n = SERVICES.length;
    let currentIndex = 0;
    // Subtract one row so item 0 lands in the MIDDLE of the 3-row window
    let currentY = n * ITEM_HEIGHT - ITEM_HEIGHT;

    track.style.transition = "none";
    track.style.transform  = `translateY(-${currentY}px)`;

    // Update active styling on all items across all 3 copies
    const updateActive = (logicalIndex: number) => {
      itemsRef.current.forEach((el, i) => {
        const copyIndex = i % n;
        const active = copyIndex === logicalIndex;
        el.style.fontSize    = active ? "1.25rem"   : "0.875rem"; // text-2xl : text-sm
        el.style.fontWeight  = active ? "900"       : "700";
        el.style.opacity     = active ? "1"         : "0.3";
      });
    };

    updateActive(0);

    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      currentIndex = (currentIndex + 1) % n;
      currentY += ITEM_HEIGHT;

      // Animate
      track.style.transition = `transform ${DURATION}ms cubic-bezier(0.77, 0, 0.18, 1)`;
      track.style.transform  = `translateY(-${currentY}px)`;

      // Update active items mid-transition so it feels live
      updateActive(currentIndex);

      // Snap back when we drift into copy2 territory
      if (currentY >= n * ITEM_HEIGHT * 2 - ITEM_HEIGHT) {
        setTimeout(() => {
          currentY -= n * ITEM_HEIGHT;
          track.style.transition = "none";
          track.style.transform  = `translateY(-${currentY}px)`;
        }, DURATION + 20);
      }

      timer = setTimeout(step, INTERVAL);
    };

    timer = setTimeout(step, INTERVAL);
    return () => clearTimeout(timer);
  }, []);

  // Render 3 copies of SERVICES
  const allItems: { label: string; globalIndex: number }[] = [];
  for (let copy = 0; copy < 3; copy++) {
    SERVICES.forEach((s, i) => {
      allItems.push({ label: s, globalIndex: copy * SERVICES.length + i });
    });
  }

  const textClass  = isWhite ? "text-white"     : "text-hero-suit";
  const labelClass = isWhite ? "text-white/60"  : "text-hero-suit/60";

  return (
    <div ref={wrapperRef} data-ticker>
      <p className={`text-[11px] font-black tracking-[0.35em] uppercase mb-6 text-center transition-colors duration-300 ${labelClass}`}>
        What I Dominate
      </p>

      {/* 3-row window */}
      <div style={{ height: ITEM_HEIGHT * 3, overflow: "hidden" }}>
        <div ref={trackRef} style={{ display: "flex", flexDirection: "column" }}>
          {allItems.map(({ label, globalIndex }) => (
            <div
              key={globalIndex}
              ref={(el) => { if (el) itemsRef.current[globalIndex] = el; }}
              className={`tracking-wide transition-colors duration-300 ${textClass}`}
              style={{
                height:         ITEM_HEIGHT,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                textAlign:      "center",
                width:          "100%",
                flexShrink:     0,
                fontSize:       "0.875rem",
                fontWeight:     "700",
                opacity:        "0.3",
                lineHeight:     "1.2",
                transition:     `opacity ${DURATION}ms ease, font-size ${DURATION}ms ease, color 300ms`,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}