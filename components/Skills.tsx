"use client";

import { useEffect, useRef } from "react";

const SKILLS = {
  row1: ["TypeScript", "React", "Node.js", "Python", "Docker"],
  row2: ["System Design", "SQL & NoSQL", "REST & GraphQL", "Git & CI/CD", "Cloud (AWS/GCP)"],
  row3: ["Testing & TDD", "Data Structures", "Algorithms", "Security", "AI / ML APIs"],
};

function repeat<T>(arr: T[], times = 4): T[] {
  return Array.from({ length: times }, () => arr).flat();
}

interface MarqueeRowProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
  accentClass: string;   // Tailwind text color class
  dotClass: string;      // Tailwind bg color class
  italic?: boolean;
  thin?: boolean;
}

function MarqueeRow({
  items,
  direction = "left",
  speed = 28,
  accentClass,
  dotClass,
  italic,
  thin,
}: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const singleSetRatio = items.length / track.children.length;

    const keyframes =
      direction === "left"
        ? [{ transform: "translateX(0)" }, { transform: `translateX(-${singleSetRatio * 100}%)` }]
        : [{ transform: `translateX(-${singleSetRatio * 100}%)` }, { transform: "translateX(0)" }];

    animRef.current = track.animate(keyframes, {
      duration: speed * 1000,
      iterations: Infinity,
      easing: "linear",
    });

    return () => animRef.current?.cancel();
  }, [direction, speed, items.length]);

  const allItems = repeat(items, 4);

  return (
    <div className="overflow-hidden border-t border-border flex">
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform"
      >
        {allItems.map((name, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-4 px-9 py-5 shrink-0"
          >
            {/* Dot */}
            <span className={`w-2 h-2 rounded-full shrink-0 inline-block ${dotClass}`} />

            {/* Skill name */}
            <span
  className={[
    "text-[clamp(18px,2.5vw,28px)]",
    "tracking-tight",
    "uppercase",
    thin ? "font-normal" : "font-bold",
    italic ? "italic" : "not-italic",
    accentClass,          // ← always apply, regardless of italic/thin
  ].join(" ")}
>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <main className="bg-hero-gradient text-foreground min-h-content overflow-hidden">

      <section className="mt-12">
        {/* Row 1 — left, lime accent (using hero shirt tan) */}
        <MarqueeRow
          items={SKILLS.row1}
          direction="left"
          speed={28}
          dotClass="bg-[var(--suit-brown)]"
          accentClass="text-hero-suit"
        />

        {/* Row 2 — right, skin tone accent, italic */}
        <MarqueeRow
          items={SKILLS.row2}
          direction="right"
          speed={22}
          dotClass="bg-[var(--shirt-tan)]"
          accentClass="text-hero-suit"
          italic
        />

        {/* Row 3 — left, shirt tan accent, thin */}
        <MarqueeRow
          items={SKILLS.row3}
          direction="left"
          speed={32}
          dotClass="bg-[var(--shirt-tan)]"
          accentClass="text-hero-suit"
          thin
        />

        {/* closing border */}
        <div className="border-b border-border" />
      </section>

    </main>
  );
}