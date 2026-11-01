// lib/cdn.ts
// Shared helper so a missing NEXT_PUBLIC_CDN_URL in local dev degrades to a
// broken-image 404 instead of throwing (`next/image` rejects "undefined/x.png").
export const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";

export function cdn(path: string): string {
  return `${CDN_URL}${path}`;
}
