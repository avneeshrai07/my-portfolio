import { TAGLINE, NAME, BIO } from "./constants";

export default function MobileLayout() {
  return (
    <div className="lg:hidden absolute inset-x-0 bottom-0 z-10">
      <div
        className="px-6 pt-8 pb-10 space-y-4"
        style={{
          background:
            "linear-gradient(to top, rgba(26,18,7,0.92) 80%, transparent)",
        }}
      >
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/50">
          {TAGLINE}
        </p>

        <h1
          className="font-hero font-black text-[#d4a882] leading-none"
          style={{ fontSize: "clamp(3.2rem, 16vw, 5rem)" }}
        >
          {NAME}
        </h1>

        <p className="text-[15px] text-white/80 leading-relaxed max-w-xs">
          {BIO}
        </p>

        {/* <div className="flex flex-wrap gap-2 pt-1">
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
        </div> */}

        <div className="flex items-center gap-6">
          <a
            href={`${process.env.NEXT_PUBLIC_CDN_URL}/Avneesh_Resume.pdf`}
            download
          >
            <button className="cursor-pointer pointer-events-auto px-8 py-4 bg-shirt-tan/80 text-hero-suit rounded-full hover:bg-shirt-tan/110 transition-all duration-300 border-2 border-white/300 font-semibold active:scale-95 text-sm">
              View Resume
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
