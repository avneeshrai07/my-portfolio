"use client";

import { useState, useRef, MouseEvent, TouchEvent, useEffect } from "react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  // Separate offsets for mobile and desktop
  const batmanOffset = {
    desktop: { x: -8, y: 0 },
    mobile: { x: 0, y: 0 }
  };

  // Detect mobile device on client-side only
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get circle size based on device
  const getCircleSize = () => {
    return isMobileDevice ? 180 : 350;
  };

  // Get Batman offset based on device
  const getBatmanOffset = () => {
    return isMobileDevice ? batmanOffset.mobile : batmanOffset.desktop;
  };

  const updateCirclePosition = (x: number, y: number) => {
    if (!containerRef.current || !circleRef.current) return;

    const circleSize = getCircleSize();
    const halfCircle = circleSize / 2;

    // Use transform directly on the element
    circleRef.current.style.transform = `translate3d(${x - halfCircle}px, ${y - halfCircle}px, 0)`;
    
    setMousePosition({ x, y });
  };

  // Mouse events for desktop
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateCirclePosition(x, y);
  };

  // Touch events for mobile - FIXED to allow scrolling
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // REMOVED e.preventDefault() to allow scrolling

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    updateCirclePosition(x, y);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsHovering(true);
    handleTouchMove(e);
  };

  const handleTouchEnd = () => {
    setIsHovering(false);
  };

  const circleSize = getCircleSize();
  const halfCircle = circleSize / 2;
  const currentOffset = getBatmanOffset();

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[115vh] overflow-hidden cursor-pointer bg-[#EEEADF]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: "pan-y", // CHANGED: Allow vertical scrolling
      }}
    >
      {/* Professional Photo - Full Background */}
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

      {/* Batman Reveal Circle */}
      <div
        ref={circleRef}
        className="absolute top-0 left-0 pointer-events-none"
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
            height: "115vh",
            backgroundImage: "url(/batman.png)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            transform: `translate3d(${-mousePosition.x + halfCircle + currentOffset.x}px, ${-mousePosition.y + halfCircle + currentOffset.y}px, 0)`,
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            imageRendering: "auto",
            contain: "paint",
          }}
        />
      </div>

      {/* Text Overlay with Matching Colors */}
      <div 
        className="absolute inset-0 flex items-center pointer-events-none z-10"
        style={{
          contain: "layout style",
        }}
      >
        <div className="container mx-auto px-8 md:px-16 max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm md:text-base text-hero-suit/80 mb-4 tracking-widest uppercase font-semibold">
              Full-Stack Developer & SaaS Builder
            </p>
            <h1 className="text-6xl text-hero-skin md:text-8xl red font-bold mb-6 leading-tight">
              Avneesh
            </h1>
            <p className="text-lg md:text-xl text-hero-suit/90 mb-8 max-w-xl">
              Building high-performance APIs, progressive web apps, and scalable
              systems.
            </p>
            <button className="pointer-events-auto px-8 py-4 bg-hero-suit/20 text-hero-suit rounded-full hover:bg-hero-suit/30 transition-all duration-300 border-2 border-hero-suit/30 font-semibold active:scale-95">
              View My Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
