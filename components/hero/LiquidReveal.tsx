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
    let noiseT    = 0;

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

    /* Layered sine noise for organic blob edge */
    const noise = (v: number) =>
      Math.sin(v * 2.1)       * 0.50 +
      Math.sin(v * 3.7 + 1.3) * 0.30 +
      Math.sin(v * 5.9 + 2.7) * 0.20;

    /* Draw a wavy circle clip path */
    const wavyClip = (cx: number, cy: number, baseR: number, t: number) => {
      ctx.beginPath();
      const steps = 80;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const wobble =
          noise(a * 1.8 + t * 0.9)  * baseR * 0.18 +
          noise(a * 3.2 + t * 0.6)  * baseR * 0.09 +
          noise(a * 6.1 + t * 0.3)  * baseR * 0.04;
        const r = baseR + wobble;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const loop = () => {
      if (destroyed) return;
      raf = requestAnimationFrame(loop);
      noiseT += 0.018;

      /* Lerp cursor */
      if (smooth.x < 0 && cursor.x > 0) { smooth.x = cursor.x; smooth.y = cursor.y; }
      smooth.x += (cursor.x - smooth.x) * 0.12;
      smooth.y += (cursor.y - smooth.y) * 0.12;
      radius   += ((isOver ? 140 : 0) - radius) * 0.08;

      /* Spawn particles on fast movement */
      if (isOver && cursor.x > 0) {
        const dx = cursor.x - prev.x;
        const dy = cursor.y - prev.y;
        const spd = Math.sqrt(dx * dx + dy * dy);
        if (spd > 7) {
          const count = Math.min(3, Math.floor(spd * 0.15));
          for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            particles.push({
              x: smooth.x, y: smooth.y,
              vx: Math.cos(a) * (1 + Math.random() * spd * 0.08),
              vy: Math.sin(a) * (1 + Math.random() * spd * 0.08),
              life: 1,
              r: 35 + Math.random() * 50,
            });
          }
        }
      }
      prev.x = cursor.x;
      prev.y = cursor.y;

      /* Update particles */
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.90; p.vy *= 0.90;
        p.life -= 0.025;
        if (p.life <= 0) particles.splice(i, 1);
      }

      /* ── Render ── */
      /* Canvas is transparent — base photo CSS div shows through everywhere */
      ctx.clearRect(0, 0, w, h);

      if (!imgReady || radius < 2 || cursor.x < 0) return;

      const drawBatmanInBlob = (cx: number, cy: number, r: number, offsetT: number) => {
        ctx.save();
        wavyClip(cx, cy, r, noiseT + offsetT);
        ctx.clip();

        /* cover-fit batman */
        const s  = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const iw = img.naturalWidth  * s;
        const ih = img.naturalHeight * s;
        ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
        ctx.restore();
      };

      /* Main cursor blob */
      drawBatmanInBlob(smooth.x, smooth.y, radius, 0);

      /* Ink particle blobs */
      for (const p of particles) {
        if (p.life > 0.05) {
          drawBatmanInBlob(p.x, p.y, p.r * p.life, p.life);
        }
      }
    };

    raf = requestAnimationFrame(loop);

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
      {/* Base — plain CSS, never touched by canvas */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:    "url(/my_professional.png)",
          backgroundSize:     "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      {/* Reveal canvas — transparent everywhere except blob */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%", zIndex: 2 }}
      />
    </>
  );
}