"use client";

import { useState, useRef, MouseEvent, TouchEvent, useEffect } from "react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const batmanOffsetX = -10;
  const batmanOffsetY = 0;

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
    return isMobileDevice ? 200 : 350;
  };

  const updateCirclePosition = (x: number, y: number) => {
    if (!containerRef.current || !circleRef.current) return;

    const circleSize = getCircleSize();
    const halfCircle = circleSize / 2;

    requestAnimationFrame(() => {
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${x - halfCircle}px, ${y - halfCircle}px)`;
      }
    });

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

  // Touch events for mobile
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

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
    >
      {/* Professional Photo - Full Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url(/my_professional.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Batman Reveal Circle */}
      <div
        ref={circleRef}
        className="absolute top-0 left-0 pointer-events-none will-change-transform"
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          borderRadius: "50%",
          overflow: "hidden",
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.3s ease",
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
            transform: `translate(${-mousePosition.x + halfCircle + batmanOffsetX}px, ${-mousePosition.y + halfCircle + batmanOffsetY}px)`,
          }}
        />
      </div>

      {/* Text Overlay with Matching Colors */}
      <div className="absolute inset-0 flex items-center pointer-events-none z-10">
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
            <button className="pointer-events-auto px-8 py-4 bg-hero-suit/10 backdrop-blur-sm text-hero-suit rounded-full hover:bg-hero-suit/20 transition-all duration-300 border-2 border-hero-suit/30 font-semibold">
              View My Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
