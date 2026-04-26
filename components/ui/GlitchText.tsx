"use client";
import { ReactNode, ElementType } from "react";

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export default function GlitchText({ children, className = "", as: Tag = "span" }: GlitchTextProps) {
  const text = typeof children === "string" ? children : "";
  const props = {
    className: `glitch-text relative inline-block ${className}`,
    "data-text": text,
  };
  return <Tag {...props}>{children}</Tag>;
}
