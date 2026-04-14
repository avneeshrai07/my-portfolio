"use client";

import { useState, useRef, useEffect } from "react";
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

  const { bioLines, bioRef } = useBioReflow(isMobile, containerRef, photoCentreRef);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#EEEADF]"
      style={{ height: "100svh", minHeight: 600, touchAction: "pan-y", cursor: "crosshair" }}
    >
      {/* BackgroundLayers listens to mousemove on the section via prop */}
      <BackgroundLayers sectionRef={containerRef} />

      <DesktopLayout
        bioLines={bioLines}
        bioRef={bioRef}
        photoCentreRef={photoCentreRef}
      />

      <MobileLayout />
    </section>
  );
}