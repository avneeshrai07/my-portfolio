import { TAGLINE, NAME, BIO, SERVICES } from "./constants";

interface DesktopLayoutProps {
  bioLines: string[];
  bioRef: React.RefObject<HTMLDivElement>;
  photoCentreRef: React.RefObject<HTMLDivElement>;
}

export default function DesktopLayout({ bioLines, bioRef, photoCentreRef }: DesktopLayoutProps) {
  return (
    <div
      className="hidden lg:grid absolute inset-0 z-10"
      style={{ gridTemplateColumns: "38% 1fr 22%" }}
    >
      {/* ── Left column ── */}
      <div
        className="flex flex-col justify-between py-12 pl-12 pr-6"
        style={{ isolation: "isolate" }}
      >
        {/* Tagline */}
        <p
          className="text-[11px] font-bold tracking-[0.25em] uppercase text-hero-suit/60"
          style={{ mixBlendMode: "difference", color: "var(--hero-suit)" }}
        >
          {TAGLINE}
        </p>

        {/* Name + Bio block */}
        <div>
          <h1
            className="font-black leading-none mb-6 text-hero-skin"
            style={{ fontSize: "clamp(4rem, 8vw, 8rem)", mixBlendMode: "difference" }}
          >
            {NAME}
          </h1>

          <div
            ref={bioRef}
            className="font-semibold text-hero-suit/90 leading-[1.8]"
            style={{ fontSize: 17, mixBlendMode: "difference" }}
          >
            {bioLines.length > 0 ? (
              bioLines.map((line, i) => <div key={i}>{line}</div>)
            ) : (
              <p className="max-w-xs">{BIO}</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-6">
          <button className="pointer-events-auto px-8 py-4 bg-hero-suit/20 text-hero-suit rounded-full hover:bg-hero-suit/30 transition-all duration-300 border-2 border-hero-suit/30 font-semibold active:scale-95 text-sm">
            View My Work
          </button>
          <div className="h-px flex-1 bg-hero-suit/20" />
        </div>
      </div>

      {/* ── Centre: pill portrait — Pretext reflow obstacle ── */}
      <div ref={photoCentreRef} className="relative flex items-end justify-center" />

      {/* ── Right column: services ── */}
      <div className="flex flex-col justify-center py-12 pr-12 pl-4">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-hero-suit/40 mb-8">
          Services
        </p>
        <ul className="space-y-4">
          {SERVICES.map((s, i) => (
            <li
              key={s}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                i === 1
                  ? "text-hero-suit"
                  : "text-hero-suit/35 hover:text-hero-suit/60"
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}