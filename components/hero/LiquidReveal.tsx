"use client";

import { useEffect, useRef, RefObject } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  r: number;
}

interface Props {
  sectionRef: RefObject<HTMLDivElement | null>;
}

export default function LiquidReveal({ sectionRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0, destroyed = false, t = 0;

    const cursor = { x: -999, y: -999 };
    const prev   = { x: -999, y: -999 };

    // blobPos lerps toward cursor while moving, then coasts on stop
    const blobPos = { x: -999, y: -999 };
    // smoothed cursor velocity — captured every frame, used to coast on stop
    const cursorVel = { x: 0, y: 0 };
    // coast velocity — active only after cursor stops
    const coastVel  = { x: 0, y: 0 };

    let radius   = 0;
    let isMoving = false;
    let moveTimer = 0;
    const MOVE_TIMEOUT = 8;
    const LINGER_FRAMES = 55; // ~0.9s at 60fps — blob holds shape before fading
    let wasMoving = false; // detect the exact frame movement stops
    let lingerTimer = 0;   // counts frames since cursor stopped

    const particles: Particle[] = [];

    const img = new Image();
    img.src = `${process.env.NEXT_PUBLIC_CDN_URL}/my_batman.png`;
    let imgReady = false;
    img.onload = () => { imgReady = true; };

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

    const noise = (v: number) =>
      Math.sin(v * 2.1) * 0.50 +
      Math.sin(v * 3.7 + 1.3) * 0.30 +
      Math.sin(v * 5.9 + 2.7) * 0.20;

    const wavyClip = (cx: number, cy: number, baseR: number, time: number) => {
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const a = (i / 120) * Math.PI * 2;
        const wobble =
          noise(a * 1.1 + time * 0.40) * baseR * 0.12 +
          noise(a * 2.0 + time * 0.65) * baseR * 0.06 +
          noise(a * 3.1 + time * 0.90) * baseR * 0.02;
        const r = Math.max(baseR * 0.4, baseR + wobble);
        i === 0
          ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
          : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx.closePath();
    };

    const drawImg = () => {
      const s  = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const iw = img.naturalWidth  * s;
      const ih = img.naturalHeight * s;
      ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    };

    const loop = () => {
      if (destroyed) return;
      raf = requestAnimationFrame(loop);
      t += 0.022;

      const dx  = cursor.x - prev.x;
      const dy  = cursor.y - prev.y;
      const spd = Math.sqrt(dx * dx + dy * dy);

      wasMoving = isMoving;
      if (spd > 0.5 && cursor.x > 0) {
        isMoving  = true;
        moveTimer = 0;
      } else {
        moveTimer++;
        if (moveTimer > MOVE_TIMEOUT) isMoving = false;
      }

      // First frame: init blob at cursor
      if (blobPos.x < 0 && cursor.x > 0) {
        blobPos.x = cursor.x;
        blobPos.y = cursor.y;
      }

      if (isMoving) {
        // PHASE 1 — TRACKING: blob follows cursor with a small lag
        // Smooth the cursor velocity for coast phase
        cursorVel.x = cursorVel.x * 0.6 + dx * 0.4;
        cursorVel.y = cursorVel.y * 0.6 + dy * 0.4;

        // Lerp blob toward cursor — 0.22 = slight lag, not instant
        blobPos.x += (cursor.x - blobPos.x) * 0.22;
        blobPos.y += (cursor.y - blobPos.y) * 0.22;

        // Reset coast vel
        coastVel.x = 0;
        coastVel.y = 0;

      } else {
        // PHASE 2 — COASTING: cursor stopped, blob carries momentum forward
        if (wasMoving && !isMoving) {
          // Exactly on the frame movement stops: capture velocity and amplify
          coastVel.x = cursorVel.x * 5.0;
          coastVel.y = cursorVel.y * 5.0;
        }

        // Damp and integrate coast
        coastVel.x *= 0.88;
        coastVel.y *= 0.88;
        blobPos.x  += coastVel.x;
        blobPos.y  += coastVel.y;
      }

      prev.x = cursor.x;
      prev.y = cursor.y;

      // Radius — appear fast, linger, then slow fade
      if (isMoving) {
        lingerTimer = 0;
      } else {
        lingerTimer++;
      }
      const waiting = lingerTimer < LINGER_FRAMES;
      const targetR = (isMoving || waiting) ? Math.max(80, Math.min(w * 0.09, 130)) : 0;
      const lerpSpd = targetR > radius ? 0.10 : 0.018;
      radius += (targetR - radius) * lerpSpd;

      // Trail particles
      if (isMoving && spd > 2) {
        const n = Math.min(3, 1 + Math.floor(spd * 0.10));
        for (let i = 0; i < n; i++) {
          const lag = (i + 1) * 0.3;
          particles.push({
            x:  blobPos.x - cursorVel.x * lag * 6 + (Math.random() - 0.5) * 8,
            y:  blobPos.y - cursorVel.y * lag * 6 + (Math.random() - 0.5) * 8,
            vx: cursorVel.x * 0.12,
            vy: cursorVel.y * 0.12,
            life: 1,
            r: radius * (0.45 + Math.random() * 0.40),
          });
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.93; p.vy *= 0.93;
        p.life -= isMoving ? 0.010 : 0.020;
        if (p.life <= 0) particles.splice(i, 1);
      }

      ctx.clearRect(0, 0, w, h);
      if (!imgReady || radius < 1 || blobPos.x < 0) return;

      ctx.save();
      wavyClip(blobPos.x, blobPos.y, radius, t);
      ctx.clip();
      drawImg();
      ctx.restore();

      for (const p of particles) {
        if (p.life < 0.04) continue;
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life * 1.5);
        wavyClip(p.x, p.y, p.r * Math.sqrt(p.life), t + p.life * 2);
        ctx.clip();
        drawImg();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      cursor.x = e.clientX - r.left;
      cursor.y = e.clientY - r.top;
    };
    const onTouch = (e: TouchEvent) => {
      const r = section.getBoundingClientRect();
      cursor.x = e.touches[0].clientX - r.left;
      cursor.y = e.touches[0].clientY - r.top;
    };

    section.addEventListener("mousemove", onMove   as EventListener);
    section.addEventListener("touchmove", onTouch  as EventListener, { passive: true });

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener("mousemove", onMove   as EventListener);
      section.removeEventListener("touchmove", onTouch  as EventListener);
    };
  }, [sectionRef]);

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/my_professional.png)`,
          backgroundSize:     "cover",
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