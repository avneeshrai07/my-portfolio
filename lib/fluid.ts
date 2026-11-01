// lib/fluid.ts
// For inline `style={{ fontSize: ... }}` values. Converts a px reference size
// into a clamp() that grows up to 20% between a 1280px laptop and an 1800px
// external monitor, and holds flat outside that range — so mobile/tablet
// (always well under 1280px) render exactly as before. Same formula as the
// --spacing / --text-* overrides in app/globals.css; keep both in sync if
// the range or growth factor ever changes.
const MIN_VW = 1280;
const MAX_VW = 1800;
const GROWTH = 0.2;

export function fluidPx(px: number): string {
  const minPx = px;
  const maxPx = px * (1 + GROWTH);
  const slope = (maxPx - minPx) / (MAX_VW - MIN_VW);
  const vwCoef = slope * 100;
  const interceptRem = (minPx - slope * MIN_VW) / 16;
  const minRem = minPx / 16;
  const maxRem = maxPx / 16;
  return `clamp(${minRem.toFixed(4)}rem, ${interceptRem.toFixed(4)}rem + ${vwCoef.toFixed(4)}vw, ${maxRem.toFixed(4)}rem)`;
}
