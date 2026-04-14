import LiquidReveal from "./LiquidReveal";
import { RefObject } from "react";

export default function BackgroundLayers({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <LiquidReveal sectionRef={sectionRef} />
      <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-[#1a1207]/90 via-[#1a1207]/25 to-transparent z-4" />
    </>
  );
}