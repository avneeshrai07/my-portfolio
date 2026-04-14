import { TAGLINE, NAME, BIO, SERVICES } from "./constants";

export default function MobileLayout() {
  return (
    <div className="lg:hidden absolute inset-x-0 bottom-0 z-10">
      <div
        className="px-6 pt-8 pb-10 space-y-4"
        style={{ background: "linear-gradient(to top, rgba(26,18,7,0.92) 80%, transparent)" }}
      >
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/50">
          {TAGLINE}
        </p>

        <h1
          className="font-black text-[#d4a882] leading-none"
          style={{ fontSize: "clamp(3.2rem, 16vw, 5rem)" }}
        >
          {NAME}
        </h1>

        <p className="text-[15px] text-white/80 leading-relaxed max-w-xs">{BIO}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          {SERVICES.map((s, i) => (
            <span
              key={s}
              className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                i === 1
                  ? "bg-white/15 border-white/40 text-white"
                  : "border-white/15 text-white/40"
              }`}
            >
              {s}
            </span>
          ))}
        </div>

        <button className="pointer-events-auto mt-2 flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#d4a882]/20 border-2 border-[#d4a882]/40 text-[#d4a882] font-bold text-sm tracking-wide active:scale-95 transition-transform">
          View My Work →
        </button>
      </div>
    </div>
  );
}