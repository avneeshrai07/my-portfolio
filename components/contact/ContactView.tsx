"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { CONTACT, CHANNELS } from "@/lib/contact";
import { fluidPx } from "@/lib/fluid";

export default function ContactView() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link below still works */
    }
  }

  return (
    <section
      ref={sectionRef}
      className="bg-hero-gradient relative overflow-hidden section-pad"
    >
      <div className="relative z-10 section-container">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div
          className={`mb-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <SectionHeader title={CONTACT.title} accent={CONTACT.accent} />
        </div>

        <p
          className={`mb-10 transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            fontSize: fluidPx(15),
            lineHeight: 1.78,
            color: "var(--proj-ink-2)",
            fontWeight: 400,
          }}
        >
          {CONTACT.intro}
        </p>

        {/* ── Primary email card ─────────────────────────────────── */}
        <div
          className={`relative border mb-5 transition-all duration-700 delay-150 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            background: "#FAF5EC",
            borderColor: "var(--proj-border-2)",
            boxShadow: "3px 4px 16px rgba(81,55,32,0.10)",
            padding: `${fluidPx(26)} ${fluidPx(24)}`,
          }}
        >
          <div className="tape" style={{ top: "-9px", left: "20px", transform: "rotate(-1deg)" }} />
          <div className="tape" style={{ top: "-9px", right: "20px", transform: "rotate(2deg)" }} />

          <p
            className="font-heading text-[clamp(0.6875rem,0.349rem_+_0.4231vw,0.825rem)] tracking-[0.22em] mb-3"
            style={{ color: "var(--proj-bark-3)", textTransform: "uppercase" }}
          >
            Drop me a line
          </p>

          <a
            href={`mailto:${CONTACT.email}`}
            className="block break-all transition-opacity hover:opacity-70"
            style={{
              fontSize: "clamp(20px, 6vw, 28px)",
              color: "var(--suit-brown)",
              letterSpacing: "-0.01em",
              fontWeight: 500,
            }}
          >
            {CONTACT.email}
          </a>

          {/* Actions — stacked on mobile, inline from sm up */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex-1 inline-flex items-center justify-center gap-2 transition-transform active:scale-95"
              style={{
                background: "var(--suit-brown)",
                color: "#FAF5EC",
                padding: `${fluidPx(13)} ${fluidPx(20)}`,
                fontSize: fluidPx(14),
                fontWeight: 600,
                letterSpacing: "0.01em",
              }}
            >
              Send an email
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address to clipboard"
              className="flex-1 inline-flex items-center justify-center gap-2 border transition-transform active:scale-95"
              style={{
                borderColor: "var(--suit-brown)",
                color: "var(--suit-brown)",
                padding: `${fluidPx(13)} ${fluidPx(20)}`,
                fontSize: fluidPx(14),
                fontWeight: 600,
                background: "transparent",
              }}
            >
              {copied ? (
                <>
                  <Check size={16} strokeWidth={2.2} /> Copied
                </>
              ) : (
                <>
                  <Copy size={16} strokeWidth={2.2} /> Copy address
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Channel list ───────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {CHANNELS.map((c, i) => {
            const Icon = c.icon;
            return (
              <a
                key={c.label}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(c.download ? { download: true } : {})}
                className={`group flex items-center gap-4 border transition-all duration-700 hover:-translate-y-0.5 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  background: "#FAF5EC",
                  borderColor: "var(--proj-border-2)",
                  boxShadow: "3px 4px 16px rgba(81,55,32,0.08)",
                  padding: `${fluidPx(16)} ${fluidPx(18)}`,
                  transitionDelay: `${0.2 + i * 0.07}s`,
                }}
              >
                <span
                  className="shrink-0 inline-flex items-center justify-center"
                  style={{
                    width: fluidPx(40),
                    height: fluidPx(40),
                    background: "var(--proj-sand)",
                    color: "var(--suit-brown)",
                  }}
                >
                  <Icon size={19} strokeWidth={1.8} />
                </span>

                <span className="flex flex-col min-w-0 flex-1">
                  <span
                    className="font-heading text-[clamp(0.625rem,0.3173rem_+_0.3846vw,0.75rem)] tracking-[0.18em]"
                    style={{ color: "var(--proj-bark-3)", textTransform: "uppercase" }}
                  >
                    {c.label}
                  </span>
                  <span
                    className="truncate"
                    style={{ fontSize: fluidPx(14), color: "var(--proj-ink-2)", fontWeight: 500 }}
                  >
                    {c.value}
                  </span>
                </span>

                <span
                  className="shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "var(--proj-bark-3)", fontSize: fluidPx(18) }}
                  aria-hidden
                >
                  →
                </span>
              </a>
            );
          })}
        </div>

        {/* ── Quick facts ────────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap gap-3">
          {CONTACT.facts.map((f) => {
            const Icon = f.icon;
            return (
              <span
                key={f.label}
                className="inline-flex items-center gap-2"
                style={{
                  border: "1px solid var(--proj-border)",
                  padding: `${fluidPx(8)} ${fluidPx(14)}`,
                  fontSize: fluidPx(12.5),
                  color: "var(--suit-brown)",
                }}
              >
                <Icon size={14} strokeWidth={1.8} style={{ color: "var(--proj-bark-3)" }} />
                <span style={{ color: "var(--proj-bark-3)" }}>{f.label}:</span>
                <span style={{ fontWeight: 600 }}>{f.value}</span>
              </span>
            );
          })}
        </div>

        <p
          className="font-caveat mt-6"
          style={{ fontSize: fluidPx(16), color: "var(--proj-bark-3)", transform: "rotate(-0.5deg)" }}
        >
          {CONTACT.note}
        </p>
      </div>
    </section>
  );
}
