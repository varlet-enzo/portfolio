"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const [variant, setVariant] = useState<"default" | "hover" | "image">("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const isLink =
        el.closest("a, button, [role='button'], input, select, textarea, label") !== null;
      const isImage = el.tagName === "IMG" || el.closest(".cursor-image") !== null;
      setVariant(isImage ? "image" : isLink ? "hover" : "default");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const animate = () => {
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${pos.current.x - 2}px, ${pos.current.y - 2}px)`;
      }
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${pos.current.x - 10}px, ${pos.current.y - 10}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  const outerSize = variant === "hover" ? 40 : variant === "image" ? 36 : 20;
  const outerBg = variant === "hover" ? "rgba(232,255,71,0.1)" : "transparent";

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full border border-accent-primary transition-all duration-150"
        style={{
          width: outerSize,
          height: outerSize,
          marginLeft: -(outerSize / 2 - 10),
          marginTop: -(outerSize / 2 - 10),
          background: outerBg,
          opacity: visible ? 1 : 0,
          boxShadow: "0 0 8px rgba(232,255,71,0.2)",
        }}
      />
      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full bg-accent-primary"
        style={{
          width: 4,
          height: 4,
          opacity: visible ? 1 : 0,
          boxShadow: "0 0 6px rgba(232,255,71,0.8)",
        }}
      />
    </>
  );
}
