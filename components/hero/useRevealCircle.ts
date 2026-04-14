import { useState, useRef, MouseEvent, TouchEvent, RefObject } from "react";

export function useRevealCircle(
  isMobile: boolean,
  containerRef: RefObject<HTMLDivElement>
) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering]       = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  const CIRCLE = isMobile ? 180 : 350;

  const updateCircle = (x: number, y: number) => {
    if (!circleRef.current) return;
    circleRef.current.style.transform = `translate3d(${x - CIRCLE / 2}px, ${y - CIRCLE / 2}px, 0)`;
    setMousePosition({ x, y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    updateCircle(e.clientX - r.left, e.clientY - r.top);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const t = e.touches[0];
    const r = containerRef.current.getBoundingClientRect();
    updateCircle(t.clientX - r.left, t.clientY - r.top);
  };

  return {
    mousePosition,
    isHovering,
    setIsHovering,
    circleRef,
    handleMouseMove,
    handleTouchMove,
  };
}