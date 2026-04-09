import type { CTAItem } from "@/types/project";
import Link from "next/link";

interface CTAProps {
  cta: CTAItem[];
}

const VARIANT_STYLES: Record<NonNullable<CTAItem["variant"]>, string> = {
  primary:
    "bg-pink-500/20 border-pink-500/40 text-pink-300 hover:bg-pink-500/30 hover:border-pink-400/60 shadow-lg shadow-pink-500/10",
  secondary:
    "bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/25",
  ghost:
    "bg-transparent border-transparent text-white/40 hover:text-white/70 hover:border-white/10 hover:bg-white/5",
};

export default function CTA({ cta }: CTAProps) {
  if (!cta.length) return null;

  return (
    <div className="flex flex-wrap gap-2 sm:justify-end">
      {cta.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold",
            "backdrop-blur-sm transition-all duration-200 select-none whitespace-nowrap",
            VARIANT_STYLES[item.variant ?? "secondary"],
          ].join(" ")}
        >
          {item.label}
          <span className="opacity-50 text-[10px]">↗</span>
        </Link>
      ))}
    </div>
  );
}