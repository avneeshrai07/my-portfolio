"use client";

import { useEffect, useRef, RefObject } from "react";

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

    let w = 0, h = 0;
    let raf = 0;
    let destroyed = false;
    let noiseT = 0;

    const cursor = { x: -999, y: -999 };
    const smooth = { x: -999, y: -999 };
    let radius   = 0;
    let isOver   = false;

    /* Load batman image */
    const img    = new Image();
    img.src      = "/batman.png";
    let imgLoaded = false;
    img.onload   = () => { imgLoaded = true; };

    /* Sync canvas pixels to layout size */
    const syncSize = () => {
      const rect = section.getBoundingClientRect();
      w = Math.round(rect.width);
      h = Math.round(rect.height);
      canvas.width  = w;
      canvas.height = h;
    };
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(section);

    /* Layered sine noise — organic wobble */
    const n = (v: number) =>
      Math.sin(v * 2.1)       * 0.5 +
      Math.sin(v * 3.7 + 1.3) * 0.3 +
      Math.sin(v * 5.9 + 2.7) * 0.2;

    const loop = () => {
      if (destroyed) return;
      raf = requestAnimationFrame(loop);
      noiseT += 0.02;

      /* Lerp cursor */
      if (smooth.x < 0 && cursor.x > 0) { smooth.x = cursor.x; smooth.y = cursor.y; }
      smooth.x += (cursor.x - smooth.x) * 0.12;
      smooth.y += (cursor.y - smooth.y) * 0.12;

      /* Animate radius */
      radius += ((isOver ? 150 : 0) - radius) * 0.1;

      ctx.clearRect(0, 0, w, h);

      if (!imgLoaded || radius < 2 || cursor.x < 0) return;

      /* Wavy clip path */
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        const wobble =
          n(a * 1.8 + noiseT)       * radius * 0.2 +
          n(a * 3.1 + noiseT * 0.7) * radius * 0.1;
        const r = radius + wobble;
        const x = smooth.x + Math.cos(a) * r;
        const y = smooth.y + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.clip();

      /* Draw batman cover-fit */
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const iw = img.naturalWidth  * scale;
      const ih = img.naturalHeight * scale;
      ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
      ctx.restore();

      /* Feather edge */
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      const f = radius * 0.28;
      const g = ctx.createRadialGradient(
        smooth.x, smooth.y, Math.max(0, radius - f),
        smooth.x, smooth.y, radius + f * 0.3,
      );
      g.addColorStop(0, "black");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    };

    raf = requestAnimationFrame(loop);

    /* Listen on the section element — always on top regardless of UI layers */
    const onMove = (e: MouseEvent) => {
      const r  = section.getBoundingClientRect();
      cursor.x = e.clientX - r.left;
      cursor.y = e.clientY - r.top;
      isOver   = true;
    };
    const onTouch = (e: TouchEvent) => {
      const r  = section.getBoundingClientRect();
      cursor.x = e.touches[0].clientX - r.left;
      cursor.y = e.touches[0].clientY - r.top;
      isOver   = true;
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
      {/* Base photo — plain CSS div, zero JS involvement */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:    "url(/my_professional.png)",
          backgroundSize:     "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Reveal canvas — only batman, only inside the blob */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%", zIndex: 2 }}
      />
    </>
  );
}