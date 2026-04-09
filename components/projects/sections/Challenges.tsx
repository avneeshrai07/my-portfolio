import type { Challenge } from "@/types/project";

interface ChallengesProps {
  challenges: Challenge[];
}

export default function Challenges({ challenges }: ChallengesProps) {
  if (!challenges.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-[11px] uppercase tracking-widest text-white/30 font-mono mb-3">
        Challenges & Solutions
      </h3>
      <div className="flex flex-col gap-3">
        {challenges.map((c, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Problem */}
              <div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-red-400/70 mb-1">
                  Problem
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{c.problem}</p>
              </div>

              {/* Arrow divider (hidden on mobile) */}
              <div className="hidden sm:flex items-center justify-center text-white/15 text-xl">
                →
              </div>

              {/* Solution + Result */}
              <div className="space-y-2">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-sky-400/70 mb-1">
                    Solution
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{c.solution}</p>
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-emerald-400/70 mb-1">
                    Result
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-medium">{c.result}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}