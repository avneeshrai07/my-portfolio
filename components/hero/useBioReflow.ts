import { useState, useRef, useEffect, useCallback, RefObject } from "react";
import { BIO } from "./constants";

type PreparedText = unknown;
interface LayoutLine { text: string; width: number }

export function useBioReflow(
  isMobile: boolean,
  containerRef: RefObject<HTMLDivElement>,
  photoCentreRef: RefObject<HTMLDivElement>
) {
  const [bioLines, setBioLines] = useState<string[]>([]);
  const bioRef = useRef<HTMLDivElement>(null);

  const reflow = useCallback(async () => {
    if (typeof window === "undefined" || isMobile) return;
    if (!containerRef.current || !photoCentreRef.current || !bioRef.current) return;

    try {
      const { prepareWithSegments, layoutNextLine } = await import("@chenglou/pretext");

      const heroRect  = containerRef.current.getBoundingClientRect();
      const photoRect = photoCentreRef.current.getBoundingClientRect();
      const bioRect   = bioRef.current.getBoundingClientRect();

      const obsLeft = photoRect.left   - heroRect.left;
      const obsTop  = photoRect.top    - heroRect.top;
      const obsBot  = photoRect.bottom - heroRect.top;

      const bioX = bioRect.left - heroRect.left;
      const bioY = bioRect.top  - heroRect.top;
      const bioW = bioRect.width;

      const FONT   = "600 17px system-ui, sans-serif";
      const LINE_H = 30;

      const handle: PreparedText = prepareWithSegments(BIO, FONT);
      const lines: string[] = [];
      let cursor: unknown = 0;

      for (let i = 0; i < 20; i++) {
        const lineTop = bioY + i * LINE_H;
        const lineMid = lineTop + LINE_H / 2;

        const overlaps = lineMid > obsTop && lineMid < obsBot;
        const lineW = overlaps
          ? Math.max(60, obsLeft - bioX - 16)
          : bioW;

        const result = (layoutNextLine as unknown as (
          p: unknown, c: unknown, w: number
        ) => [LayoutLine, unknown] | null)(handle, cursor, lineW);

        if (!result) break;
        const [line, nextCursor] = result;
        lines.push(line.text);
        cursor = nextCursor;
      }

      setBioLines(lines);
    } catch {
      setBioLines([]);
    }
  }, [isMobile, containerRef, photoCentreRef]);

  useEffect(() => {
    const t = setTimeout(reflow, 100);
    window.addEventListener("resize", reflow);
    return () => { clearTimeout(t); window.removeEventListener("resize", reflow); };
  }, [reflow]);

  return { bioLines, bioRef };
}