import { TAGLINE, NAME, BIO } from "./constants";
import ServiceTicker from "./ServiceTicker";

interface DesktopLayoutProps {
  bioLines: string[];
  bioRef: React.RefObject<HTMLDivElement | null>;
  photoCentreRef: React.RefObject<HTMLDivElement | null>;
}

export default function DesktopLayout({ bioLines, bioRef, photoCentreRef }: DesktopLayoutProps) {
  return (
    <div
      className="hidden lg:grid absolute inset-0 z-10"
      style={{ gridTemplateColumns: "38% 1fr 35%" }}
    >
      {/* ── Left column ── */}
      <div
        className="flex flex-col justify-between py-12 pl-12 pr-6"
        style={{ isolation: "isolate" }}
      >
        {/* Top spacer */}
        <div />

        {/* Name block — tagline sits right above the name */}
        <div>
          <p
            className="font-semibold text-hero-suit/90 leading-[1.8] mb-2"
            style={{ fontSize: 17, mixBlendMode: "difference" }}
          >
            {TAGLINE}
          </p>

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
          <a href="/resume.pdf" download>
            <button className="cursor-pointer pointer-events-auto px-8 py-4 bg-hero-suit/20 text-hero-suit rounded-full hover:bg-hero-suit/30 transition-all duration-300 border-2 border-hero-suit/30 font-semibold active:scale-95 text-sm">
              View Resume
            </button>
          </a>
          <div className="h-px flex-1 bg-hero-suit/20" />
        </div>
      </div>

      {/* ── Centre: pill portrait ── */}
      <div ref={photoCentreRef} className="relative flex items-end justify-center" />

      {/* ── Right column: services ticker ── */}
      <div className="flex flex-col justify-center py-12 pr-12 pl-6">
        <ServiceTicker />
      </div>
    </div>
  );
}