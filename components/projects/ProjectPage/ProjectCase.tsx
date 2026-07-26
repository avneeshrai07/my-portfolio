"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Target, Lightbulb } from "lucide-react";
import StackIcon from "tech-stack-icons";
import { techStack } from "@/types/techStack";
import type { Project } from "@/types/projects";

const TECH_BY_NAME = Object.fromEntries(techStack.map((t) => [t.name.toLowerCase(), t]));
const TECH_ALIASES: Record<string, string> = {
  "next.js": "next.js", "node.js": "node.js", "aws s3": "aws",
  "socket.io": "socket.io", "postgresql": "postgresql", "go": "go",
};
function resolveTech(name: string) {
  const key = TECH_ALIASES[name.toLowerCase()] ?? name.toLowerCase();
  return TECH_BY_NAME[key] ?? { name, iconName: name.toLowerCase().replace(/[^a-z0-9]/g, ""), bubbleColor: "#888" };
}

const card = { background: "#fff", border: "1px solid var(--proj-border-2)" } as const;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 flex items-center gap-2">
      <span className="font-heading text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--proj-bark-3)" }}>{children}</span>
      <span className="h-px flex-1" style={{ background: "var(--proj-border-2)" }} />
    </h2>
  );
}

/* Count-up animated metric value. Parses the first number in the string and
   animates 0 → number when scrolled into view, preserving any prefix/suffix. */
function MetricValue({ value, highlight }: { value: string; highlight?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [disp, setDisp] = useState(value);

  useEffect(() => {
    const m = value.match(/\d[\d,]*\.?\d*/);
    const el = ref.current;
    if (!m || !el) return;
    const target = parseFloat(m[0].replace(/,/g, ""));
    const prefix = value.slice(0, m.index);
    const suffix = value.slice((m.index ?? 0) + m[0].length);
    setDisp(prefix + "0" + suffix);
    let started = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting || started) return;
        started = true; obs.disconnect();
        const dur = 1000, t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          if (p < 1) { setDisp(prefix + String(Math.round(target * eased)) + suffix); requestAnimationFrame(tick); }
          else setDisp(value);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-[19px] font-bold leading-none" style={{ color: highlight ? "#F5DCC0" : "var(--proj-ink)", letterSpacing: "-0.02em" }}>{disp}</div>
  );
}

function NavThumb({ src, name }: { src: string; name: string }) {
  return (
    <span className="relative block h-11 w-14 shrink-0 overflow-hidden rounded-lg" style={{ border: "1px solid var(--proj-border-2)" }}>
      <Image src={src} alt={name} fill sizes="56px" className="object-cover" />
    </span>
  );
}

export default function ProjectCase({ project: p, prev, next }: { project: Project; prev: Project; next: Project }) {
  const isLive = p.status === "Production";
  const heroRef = useRef<HTMLElement>(null);
  const [showBar, setShowBar] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Balanced columns: pack whole sections into the shorter column ──────────
  type Sec = "overview" | "problem" | "challenges" | "features" | "decisions" | "stack";
  const sections: { key: Sec; h: number }[] = [];
  if (p.overview) sections.push({ key: "overview", h: 60 + (p.overview.length / 55) * 20 });
  if (p.problem) sections.push({ key: "problem", h: 90 + (Math.max(p.problem.length, (p.impact || p.sub).length) / 38) * 17 });
  if (p.challenges?.length) sections.push({ key: "challenges", h: 30 + p.challenges.reduce((a, c) => a + 30 + (c.length / 48) * 17, 0) });
  if (p.features?.length) sections.push({ key: "features", h: 30 + p.features.reduce((a, f) => a + 38 + (f.desc.length / 44) * 16, 0) });
  if (p.decisions?.length) sections.push({ key: "decisions", h: 30 + p.decisions.reduce((a, d) => a + 28 + (d.length / 46) * 16, 0) });
  if (p.stack?.length) sections.push({ key: "stack", h: 30 + Math.ceil(p.stack.length / 4) * 30 });

  const colH = [0, 0];
  const colKeys: Sec[][] = [[], []];
  [...sections].sort((a, b) => b.h - a.h).forEach((s) => {
    const c = colH[0] <= colH[1] ? 0 : 1;
    colKeys[c].push(s.key); colH[c] += s.h;
  });
  const order: Sec[] = ["overview", "problem", "challenges", "features", "decisions", "stack"];
  const ordered = (keys: Sec[]) => order.filter((k) => keys.includes(k));

  const renderSection = (key: Sec) => {
    switch (key) {
      case "overview":
        return (
          <section key={key}>
            <Label>Overview</Label>
            <p className="text-[13px] leading-[1.7]" style={{ color: "var(--proj-ink-2)" }}>{p.overview}</p>
          </section>
        );
      case "problem":
        return (
          <section key={key} className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl p-4" style={{ ...card, borderLeft: "3px solid var(--proj-terra)" }}>
              <div className="mb-2 inline-flex items-center gap-1.5"><Target size={13} style={{ color: "var(--proj-terra)" }} /><span className="font-heading text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--proj-terra)" }}>Problem</span></div>
              <p className="text-[12px] leading-[1.55]" style={{ color: "var(--proj-ink-3)" }}>{p.problem}</p>
            </div>
            <div className="rounded-xl p-4" style={{ ...card, borderLeft: "3px solid var(--proj-moss-bd)" }}>
              <div className="mb-2 inline-flex items-center gap-1.5"><Lightbulb size={13} style={{ color: "#5A8040" }} /><span className="font-heading text-[10px] uppercase tracking-[0.12em]" style={{ color: "#5A8040" }}>Approach</span></div>
              <p className="text-[12px] leading-[1.55]" style={{ color: "var(--proj-ink-3)" }}>{p.impact || p.sub}</p>
            </div>
          </section>
        );
      case "challenges":
        return (
          <section key={key}>
            <Label>Engineering challenges</Label>
            <div className="flex flex-col gap-2">
              {p.challenges.map((ch, i) => (
                <div key={i} className="flex gap-3 rounded-lg p-3" style={card}>
                  <span className="shrink-0 font-heading text-[13px] font-bold" style={{ color: "var(--proj-border)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[12px] leading-[1.55]" style={{ color: "var(--proj-ink-3)" }}>{ch}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case "features":
        return (
          <section key={key}>
            <Label>Key features</Label>
            <div className="flex flex-col gap-1.5">
              {p.features.map((f) => (
                <div key={f.title} className="rounded-lg p-3" style={card}>
                  <h3 className="text-[12.5px] font-semibold" style={{ color: "var(--proj-ink-2)" }}>{f.title}</h3>
                  <p className="mt-0.5 text-[11.5px] leading-[1.5]" style={{ color: "var(--proj-ink-3)" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case "decisions":
        return (
          <section key={key}>
            <Label>Key decisions</Label>
            <div className="flex flex-col gap-1.5">
              {p.decisions.map((d, i) => (
                <div key={i} className="flex gap-2 rounded-lg p-3" style={card}>
                  <span className="mt-0.5 shrink-0 text-[10px]" style={{ color: "var(--proj-terra)" }}>◆</span>
                  <p className="text-[11.5px] leading-[1.5]" style={{ color: "var(--proj-ink-3)" }}>{d}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case "stack":
        return (
          <section key={key}>
            <Label>Built with</Label>
            <div className="flex flex-wrap gap-1.5">
              {p.stack.map((name) => {
                const tech = resolveTech(name);
                return (
                  <span key={name} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={card}>
                    <StackIcon name={tech.iconName} style={{ width: 13, height: 13, flexShrink: 0 }} />
                    <span className="text-[11px] font-medium" style={{ color: "var(--proj-ink-2)" }}>{tech.name}</span>
                  </span>
                );
              })}
            </div>
          </section>
        );
    }
  };

  return (
    <div style={{ background: "var(--proj-cream)" }}>
      <div className="mx-auto max-w-6xl px-5 pt-24 pb-14 md:px-8 md:pt-28">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <span className="font-heading text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--proj-bark-3)" }}>{p.num} — {p.category}</span>
          <Link href="/#projects" className="font-heading text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-60" style={{ color: "var(--proj-bark-3)" }}>← All projects</Link>
        </div>

        {/* Hero */}
        <header ref={heroRef} className="grid items-stretch gap-5 md:grid-cols-[1fr_minmax(0,360px)]">
          <div className="flex flex-col justify-center">
            <div className="mb-2 flex items-center gap-2">
              {isLive && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background: "var(--proj-tag-live-bg)", color: "var(--proj-tag-live-tx)", border: "1px solid var(--proj-tag-live-bd)" }}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#5A9A30", animation: "pf-pulse 2s ease-in-out infinite" }} />Live
                </span>
              )}
              <span className="font-heading text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--proj-bark-3)" }}>{p.category}</span>
            </div>
            <h1 className="text-[clamp(1.5rem,3.2vw,2.2rem)] font-bold leading-[1.08]" style={{ color: "var(--proj-ink)", letterSpacing: "-0.02em" }}>{p.name}</h1>
            <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: "var(--proj-ink-3)" }}>{p.sub}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {p.demoUrl && (
                <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12.5px] font-semibold transition-transform hover:-translate-y-0.5" style={{ background: "var(--proj-terra)", color: "#fff" }}>View live <ArrowUpRight size={14} strokeWidth={2.3} /></a>
              )}
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12.5px] font-semibold transition-transform hover:-translate-y-0.5" style={{ ...card, color: "var(--proj-ink-2)" }}><Github size={14} strokeWidth={1.9} /> Source</a>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {([["Role", p.role], ["Type", p.type], ["Year", p.year], ["Timeline", p.duration]] as const).map(([k, v]) => v && (
                <div key={k}>
                  <div className="font-heading text-[8.5px] uppercase tracking-[0.12em]" style={{ color: "var(--proj-bark-3)" }}>{k}</div>
                  <div className="text-[12px] font-medium" style={{ color: "var(--proj-ink-2)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[200px] overflow-hidden rounded-2xl" style={{ border: "1px solid var(--proj-border-2)", background: "var(--proj-sand)" }}>
            <Image src={p.image} alt={p.name} fill priority sizes="360px" onLoad={() => setHeroLoaded(true)} className={`object-cover transition-opacity duration-700 ${heroLoaded ? "opacity-100" : "opacity-0"}`} />
          </div>
        </header>

        {/* Metrics strip */}
        {p.metrics?.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6">
            {p.metrics.map((m) => (
              <div key={m.label} className="rounded-xl px-3 py-3 text-center" style={m.highlight ? { background: "var(--proj-bark)", border: "1px solid var(--proj-bark)" } : card}>
                <MetricValue value={m.value} highlight={m.highlight} />
                <div className="mt-1.5 text-[9px] font-medium leading-tight" style={{ color: m.highlight ? "#C8956A" : "var(--proj-bark-3)" }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Balanced two-column body */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-6">{ordered(colKeys[0]).map(renderSection)}</div>
          <div className="flex flex-col gap-6">{ordered(colKeys[1]).map(renderSection)}</div>
        </div>

        {/* Prev / Next with thumbnails */}
        <nav className="mt-10 grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-2" style={{ borderColor: "var(--proj-border-2)" }}>
          <Link href={prev.href} className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white">
            <NavThumb src={prev.image} name={prev.name} />
            <span className="min-w-0">
              <span className="block font-heading text-[9px] uppercase tracking-[0.16em]" style={{ color: "var(--proj-bark-3)" }}>← Prev</span>
              <span className="block truncate text-[13px] font-semibold transition-colors group-hover:text-[color:var(--proj-terra)]" style={{ color: "var(--proj-ink)" }}>{prev.name}</span>
            </span>
          </Link>
          <Link href={next.href} className="group flex items-center justify-end gap-3 rounded-xl p-3 text-right transition-colors hover:bg-white">
            <span className="min-w-0">
              <span className="block font-heading text-[9px] uppercase tracking-[0.16em]" style={{ color: "var(--proj-bark-3)" }}>Next →</span>
              <span className="block truncate text-[13px] font-semibold transition-colors group-hover:text-[color:var(--proj-terra)]" style={{ color: "var(--proj-ink)" }}>{next.name}</span>
            </span>
            <NavThumb src={next.image} name={next.name} />
          </Link>
        </nav>
      </div>

      {/* Sticky action bar (appears after hero scrolls out) */}
      <div className={`fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full py-2 pl-4 pr-2 transition-all duration-300 ${showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
        style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--proj-border-2)", boxShadow: "0 8px 28px rgba(81,55,32,0.16)", backdropFilter: "blur(8px)" }}>
        <span className="max-w-[38vw] truncate text-[12.5px] font-semibold sm:max-w-xs" style={{ color: "var(--proj-ink)" }}>{p.name}</span>
        {p.demoUrl && (
          <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[12px] font-semibold" style={{ background: "var(--proj-terra)", color: "#fff" }}>View live <ArrowUpRight size={12} strokeWidth={2.4} /></a>
        )}
        {p.githubUrl && (
          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="Source" className="inline-flex items-center justify-center rounded-full p-2" style={{ color: "var(--proj-ink-2)" }}><Github size={15} strokeWidth={1.9} /></a>
        )}
      </div>
    </div>
  );
}
