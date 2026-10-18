import { NextResponse } from "next/server";

// The hero's fluid-reveal effect (components/hero/LiquidReveal.tsx) uploads
// this image into a WebGL texture, which requires it to be same-origin or
// served with CORS headers. The CDN doesn't send those, so this route fetches
// it server-side (no CORS applies between servers) and re-serves it from our
// own origin, cached at the edge.
const SOURCE_URL = `${process.env.NEXT_PUBLIC_CDN_URL}/my_batman.png`;

export async function GET() {
  const upstream = await fetch(SOURCE_URL, {
    next: { revalidate: 60 * 60 * 24 * 30 },
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: "Image unavailable" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/png",
      "Cache-Control": "public, max-age=2592000, immutable",
    },
  });
}
