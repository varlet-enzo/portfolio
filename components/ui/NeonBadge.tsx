import { ReactNode } from "react";

interface NeonBadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "cyan" | "muted";
  pulse?: boolean;
  dot?: boolean;
  className?: string;
}

const variantStyles = {
  primary: "border-accent-primary text-accent-primary bg-accent-primary/10",
  secondary: "border-accent-secondary text-accent-secondary bg-accent-secondary/10",
  cyan: "border-accent-glow text-accent-glow bg-accent-glow/10",
  muted: "border-text-muted text-text-muted bg-text-muted/10",
};

const dotColors = {
  primary: "bg-accent-primary",
  secondary: "bg-accent-secondary",
  cyan: "bg-accent-glow",
  muted: "bg-text-muted",
};

export default function NeonBadge({
  children,
  variant = "primary",
  pulse = false,
  dot = false,
  className = "",
}: NeonBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-xs tracking-widest uppercase ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-2 h-2 rounded-full ${dotColors[variant]} ${pulse ? "animate-pulse" : ""}`} />
      )}
      {children}
    </span>
  );
}
