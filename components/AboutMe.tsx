"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/shared/SectionHeader";

/* ─── Pull these from your constants file ─────────────────────────────────
   e.g. import { ABOUT_ME } from "@/constants";
──────────────────────────────────────────────────────────────────────────── */
export const ABOUT_ME = {
  polaroidCaption: "Avneesh Rai",
  bioLabel: "Subject Profile",
  bioParagraphs: [
<>
I'm a <strong>Python Backend Developer & AI/ML Enthusiast</strong>.
Curiosity is the thread that runs through everything I do. I enjoy
building things, understanding how they work, and exploring unfamiliar
territory—whether that's a new technology, a new idea, or a new experience.
</>,
<>
I'm always looking for opportunities to grow, create, and challenge
myself. My goal is simple: build meaningful things, keep learning
relentlessly, and make each year more interesting than the last.
</>,
],
annotation: "→ Curious by default. Building by choice.",

  stats: [
    { label: "Based in",  value: "Ghazipur, IN" },
    { label: "Role",      value: "Backend Developer"  },
    { label: "Focus",     value: "AI & ML Dev"   },
    { label: "Exp.",      value: "1+ Years"       },
    { label: "Available", value: "Open to offers" },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────── */

export default function AboutMe() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-hero-gradient relative overflow-hidden section-pad px-5 md:px-10"
    >
      <div className="relative z-10 max-w-5xl mx-auto">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className={`mb-14 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}>
            <SectionHeader title="About" accent="Me" />
          </div>

          {/* ── Card Grid ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

            {/* ── CARD 1a: Polaroid — mobile only (compact, centered) ── */}
            <div
              className={`
                md:hidden mx-auto relative border
                transition-all duration-700
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
              `}
              style={{
                width: "min(62%, 220px)",
                background: "#FAF5EC",
                borderColor: "var(--proj-border-2, #D4B896)",
                boxShadow: "3px 4px 16px rgba(81,55,32,0.10)",
                padding: "12px 12px 30px",
                transform: visible ? "rotate(-1.5deg)" : "rotate(-1.5deg) translateY(24px)",
                transitionDelay: "0.05s",
              }}
            >
              <div className="tape" style={{ top: "-9px", left: "50%", marginLeft: -24, transform: "rotate(-2deg)" }} />

              <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/avneesh.jpg`}
                  alt="Avneesh Rai, Backend Engineer and AI/ML Developer based in New Delhi"
                  fill
                  className="object-cover"
                  style={{ filter: "sepia(0.18) contrast(1.05)" }}
                  sizes="(max-width: 768px) 62vw, 0px"
                />
              </div>

              <p
                className="font-caveat font-semibold text-center mt-2.5"
                style={{ fontSize: "16px", color: "var(--proj-ink-3, #5A3E28)" }}
              >
                {ABOUT_ME.polaroidCaption}
              </p>
            </div>

            {/* ── CARD 1: Polaroid — desktop only ── */}
            <div
              className={`
                hidden md:block
                card-photo ${visible ? "card-in" : ""}
                relative row-span-2 border
                ${visible ? "opacity-100" : "opacity-0"}
              `}
              style={{
                background: "#FAF5EC",
                borderColor: "var(--proj-border-2, #D4B896)",
                boxShadow: "3px 4px 16px rgba(81,55,32,0.10)",
                padding: "14px 14px 36px",
                transitionDelay: "0.1s",
              }}
            >
              <div className="tape" style={{ top: "-9px", left: "20px", transform: "rotate(-1deg)" }} />

              <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/avneesh.jpg`}
                  alt="Avneesh Rai, Backend Engineer and AI/ML Developer based in New Delhi"
                  fill
                  className="object-cover"
                  style={{ filter: "sepia(0.18) contrast(1.05)" }}
                  sizes="(max-width: 768px) 0px, 33vw"
                />
              </div>

              <p
                className="font-caveat font-semibold text-center mt-2.5"
                style={{ fontSize: "17px", color: "var(--proj-ink-3, #5A3E28)" }}
              >
                {ABOUT_ME.polaroidCaption}
              </p>
            </div>

            {/* ── CARD 2: Bio ── */}
            <div
              className={`
                col-span-1 md:col-span-2
                relative border
                transition-all duration-700
                hover:-translate-y-0.5
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
              style={{
                background: "#FAF5EC",
                borderColor: "var(--proj-border-2, #D4B896)",
                boxShadow: "3px 4px 16px rgba(81,55,32,0.10)",
                padding: "32px 36px",
                transitionDelay: "0.2s",
              }}
            >
              <div className="tape" style={{ top: "-9px", left: "20px", transform: "rotate(-1deg)" }} />
              <div className="tape" style={{ top: "-9px", right: "20px", transform: "rotate(2deg)" }} />

              {/* Label */}
              <p
                className="bio-label-rule font-heading text-[11px] tracking-[0.22em] flex items-center gap-3 mb-5"
                style={{ color: "var(--proj-bark-3, #9A6A48)", textTransform: "uppercase" }}
              >
                {ABOUT_ME.bioLabel}
              </p>

              {ABOUT_ME.bioParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="bio-para mb-4"
                  style={{ fontSize: "14.5px", lineHeight: 1.78, color: "var(--proj-ink-2, #3A2010)", fontWeight: 400 }}
                >
                  {para}
                </p>
              ))}

              <span
                className="font-caveat inline-block pb-0.5 mt-1"
                style={{
                  fontSize: "15px",
                  color: "var(--proj-bark-3, #9A6A48)",
                  transform: "rotate(-0.5deg)",
                  borderBottom: "1.5px solid var(--proj-border, #C8A870)",
                }}
              >
                {ABOUT_ME.annotation}
              </span>
            </div>

            {/* ── CARD 3: Stats ── */}
            <div
              className={`
                card-stats ${visible ? "card-in" : ""}
                relative border
                ${visible ? "opacity-100" : "opacity-0"}
              `}
              style={{
                background: "#FAF5EC",
                borderColor: "var(--proj-border-2, #D4B896)",
                boxShadow: "3px 4px 16px rgba(81,55,32,0.10)",
                padding: "24px 28px",
                transitionDelay: "0.35s",
              }}
            >
              {/* Paper clip SVG */}
              <svg
                className="absolute z-10"
                style={{ top: "-6px", left: "16px" }}
                width="20" height="44" viewBox="0 0 20 44" fill="none"
              >
                <path
                  d="M10 2 C4 2 2 6 2 10 L2 34 C2 40 6 42 10 42 C14 42 18 40 18 34 L18 12 C18 8 16 6 12 6 L10 6 C7 6 6 8 6 10 L6 32 C6 34 7 35 9 35 L14 35"
                  stroke="#9A6A48" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6"
                />
              </svg>

              {ABOUT_ME.stats.map(({ label, value }) => (
                <div key={label} className="stat-row flex items-baseline justify-between gap-3 py-2.5">
                  <span
                    className="font-heading tracking-[0.1em]"
                    style={{ fontSize: "10px", color: "var(--proj-bark-3, #9A6A48)", minWidth: "80px", textTransform: "uppercase" }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-medium text-right flex-1"
                    style={{ fontSize: "13px", color: "var(--suit-brown, #513720)", letterSpacing: "-0.01em" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
    </section>
  );
}