"use client";

import { useEffect, useRef, RefObject } from "react";
import type { FluidSolver } from "./fluid/FluidSolver";

interface Props {
  sectionRef: RefObject<HTMLDivElement | null>;
}

const SPLAT_FORCE = 6000;
const STRENGTH_SCALE = 60;
const MAX_SPLAT_STRENGTH = 1.2;
const MOVE_DEAD_ZONE = 0.00015;

export default function LiquidReveal({ sectionRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let destroyed = false;
    let raf = 0;
    let solver: FluidSolver | null = null;
    let ro: ResizeObserver | null = null;
    let lastTime = performance.now();
    let paused = document.hidden;

    const pointer = { x: -1, y: -1 };
    let prevX = -1;
    let prevY = -1;

    const setPointer = (clientX: number, clientY: number) => {
      const r = section!.getBoundingClientRect();
      pointer.x = (clientX - r.left) / r.width;
      pointer.y = 1 - (clientY - r.top) / r.height;
    };

    const onMouseMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("touchmove", onTouchMove, { passive: true });

    const onVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
    };
    const onContextRestored = () => {
      init();
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    function loop(now: number) {
      if (destroyed) return;
      raf = requestAnimationFrame(loop);
      if (paused || !solver) {
        lastTime = now;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;

      if (pointer.x >= 0 && prevX >= 0) {
        const dx = pointer.x - prevX;
        const dy = pointer.y - prevY;
        const speed = Math.hypot(dx, dy);
        if (speed > MOVE_DEAD_ZONE) {
          solver.splat(pointer.x, pointer.y, dx * SPLAT_FORCE, dy * SPLAT_FORCE, Math.min(MAX_SPLAT_STRENGTH, speed * STRENGTH_SCALE));
        }
      }
      if (pointer.x >= 0) {
        prevX = pointer.x;
        prevY = pointer.y;
      }

      solver.step(dt);
      solver.render();
    }

    async function init() {
      const { FluidSolver: Solver } = await import("./fluid/FluidSolver");
      if (destroyed || !canvas || !section) return;

      try {
        solver = new Solver(canvas, {
          // Same-origin proxy (see app/api/hero-reveal-image) so the WebGL
          // texture upload isn't blocked by the CDN's missing CORS headers.
          imageUrl: "/api/hero-reveal-image",
        });
      } catch (err) {
        console.error("[hero] fluid reveal unavailable:", err);
        return;
      }

      const syncSize = () => {
        const r = section!.getBoundingClientRect();
        solver?.resize(Math.round(r.width), Math.round(r.height));
      };
      syncSize();
      ro = new ResizeObserver(syncSize);
      ro.observe(section);

      lastTime = performance.now();
      raf = requestAnimationFrame(loop);
    }

    init();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      solver?.dispose();
    };
  }, [sectionRef]);

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/my_professional.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%", zIndex: 2 }}
      />
    </>
  );
}
