"use client";

import { useState, useRef, useEffect, RefObject } from "react";
import BackgroundLayers from "./hero/BackgroundLayers";
import DesktopLayout    from "./hero/DesktopLayout";
import MobileLayout     from "./hero/MobileLayout";
import { useBioReflow } from "./hero/useBioReflow";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef   = useRef<HTMLDivElement>(null);
  const photoCentreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { bioLines, bioRef } = useBioReflow(isMobile, containerRef as RefObject<HTMLDivElement | null>, photoCentreRef as RefObject<HTMLDivElement | null>);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#EEEADF]"
      style={{ height: "100svh", minHeight: 600, touchAction: "pan-y", cursor: "default" }}
    >
      {/* BackgroundLayers listens to mousemove on the section via prop */}
      <BackgroundLayers sectionRef={containerRef as RefObject<HTMLDivElement | null>} />

      <DesktopLayout
        bioLines={bioLines}
        bioRef={bioRef}
        photoCentreRef={photoCentreRef}
      />

      <MobileLayout />
    </section>
  );
}