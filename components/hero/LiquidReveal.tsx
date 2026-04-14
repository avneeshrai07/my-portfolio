"use client";

import { useEffect, useRef, RefObject } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  r: number;
}

interface Props {
  sectionRef: RefObject<HTMLDivElement>;
}

export default function LiquidReveal({ sectionRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d")!;

    let w = 0, h = 0, raf = 0;
    let destroyed = false;
    let noiseT = 0;

    const cursor = { x: -999, y: -999 };
    const prev   = { x: -999, y: -999 };
    const smooth = { x: -999, y: -999 };
    let radius = 0, isOver = false;
    const particles: Particle[] = [];

    const img    = new Image();
    img.src      = "/batman.png";
    let imgReady = false;
    img.onload   = () => { imgReady = true; };

    const syncSize = () => {
      const r = section.getBoundingClientRect();
      w = Math.round(r.width);
      h = Math.round(r.height);
      canvas.width  = w;
      canvas.height = h;
    };
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(section);

    /* ─── Noise: 3 layered sines, returns -1..1 ─── */
    const noise = (v: number) =>
      Math.sin(v * 2.1)        * 0.50 +
      Math.sin(v * 3.7 + 1.3)  * 0.30 +
      Math.sin(v * 5.9 + 2.7)  * 0.20;

    /* ─── Build wavy blob clip path ─── */
    const wavyClip = (
      cx: number, cy: number,
      baseR: number, t: number,
    ) => {
      ctx.beginPath();
      const steps = 120; // more steps = smoother curves
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;

        // low frequency = fewer rounder bumps, not spiky
        const wobble =
          noise(a * 1.1 + t * 0.40) * baseR * 0.12 +  // 1–2 big gentle swells
          noise(a * 2.0 + t * 0.65) * baseR * 0.06 +  // soft secondary
          noise(a * 3.1 + t * 0.90) * baseR * 0.02;   // barely-there texture

        const r = Math.max(baseR * 0.4, baseR + wobble); // never collapses
        ctx.lineTo(
          cx + Math.cos(a) * r,
          cy + Math.sin(a) * r,
        );
      }
      ctx.closePath();
    };

    /* ─── Cover-fit draw ─── */
    const drawImg = () => {
      const s  = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const iw = img.naturalWidth  * s;
      const ih = img.naturalHeight * s;
      ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    };

    /* ─── Render loop ─── */
    const loop = () => {
      if (destroyed) return;
      raf = requestAnimationFrame(loop);
      noiseT += 0.020; // speed of idle morph

      /* Smooth cursor follow */
      if (smooth.x < 0 && cursor.x > 0) { smooth.x = cursor.x; smooth.y = cursor.y; }
      smooth.x += (cursor.x - smooth.x) * 0.14;
      smooth.y += (cursor.y - smooth.y) * 0.14;

      /* Radius spring — wider blob */
      radius += ((isOver ? 140 : 0) - radius) * 0.07;

      /* Spawn trail blobs constantly while moving, not just on fast swipe */
      if (isOver && cursor.x > 0) {
        const dx  = cursor.x - prev.x;
        const dy  = cursor.y - prev.y;
        const spd = Math.sqrt(dx * dx + dy * dy);
        if (spd > 2) {
          /* Always spawn 1-3 trail blobs behind the cursor */
          const n = Math.min(3, 1 + Math.floor(spd * 0.12));
          for (let i = 0; i < n; i++) {
            /* Spawn slightly behind cursor in direction of travel */
            const lag = (i + 1) * 0.18;
            particles.push({
              x: smooth.x - dx * lag * 4 + (Math.random() - 0.5) * 12,
              y: smooth.y - dy * lag * 4 + (Math.random() - 0.5) * 12,
              vx: -dx * 0.04 + (Math.random() - 0.5) * 0.4,
              vy: -dy * 0.04 + (Math.random() - 0.5) * 0.4,
              life: 1,
              r: radius * (0.55 + Math.random() * 0.35), // trail blobs relative to main
            });
          }
        }
      }
      prev.x = cursor.x;
      prev.y = cursor.y;

      /* Update particles — slow decay for long tail */
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x    += p.vx;  p.y    += p.vy;
        p.vx   *= 0.92;  p.vy   *= 0.92;
        p.life -= 0.012; // very slow fade = long lasting tail
        if (p.life <= 0) particles.splice(i, 1);
      }

      /* ── Draw ── */
      ctx.clearRect(0, 0, w, h);
      if (!imgReady || radius < 2 || cursor.x < 0) return;

      /* Main blob */
      ctx.save();
      wavyClip(smooth.x, smooth.y, radius, noiseT);
      ctx.clip();
      drawImg();
      ctx.restore();

      /* Ink drip particles */
      for (const p of particles) {
        if (p.life < 0.05) continue;
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life * 1.4);
        wavyClip(p.x, p.y, p.r * p.life, noiseT + p.life * 3);
        ctx.clip();
        drawImg();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(loop);

    /* ── Events on the section (top-level, never blocked by UI layers) ── */
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      cursor.x = e.clientX - r.left;
      cursor.y = e.clientY - r.top;
      isOver = true;
    };
    const onTouch = (e: TouchEvent) => {
      const r = section.getBoundingClientRect();
      cursor.x = e.touches[0].clientX - r.left;
      cursor.y = e.touches[0].clientY - r.top;
      isOver = true;
    };
    const onLeave = () => { isOver = false; };

    section.addEventListener("mousemove",  onMove   as EventListener);
    section.addEventListener("mouseleave", onLeave);
    section.addEventListener("touchmove",  onTouch  as EventListener, { passive: true });
    section.addEventListener("touchend",   onLeave);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener("mousemove",  onMove   as EventListener);
      section.removeEventListener("mouseleave", onLeave);
      section.removeEventListener("touchmove",  onTouch  as EventListener);
      section.removeEventListener("touchend",   onLeave);
    };
  }, [sectionRef]);

  return (
    <>
      {/* Base photo — plain CSS, zero canvas involvement */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:    "url(/my_professional.png)",
          backgroundSize:     "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      {/* Reveal canvas — fully transparent except inside blob */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%", zIndex: 2 }}
      />
    </>
  );
}